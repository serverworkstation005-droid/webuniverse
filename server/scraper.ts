import { SEARCH_PROVIDERS } from "../src/data/searchResources";

export interface ScraperResult {
  providerName: string;
  domain: string;
  status: "success" | "error" | "no_results";
  searchUrl: string;
  message?: string;
  responseTime?: number;
  scrapedItems?: { title: string; link: string; poster: string }[];
}

// Global Domain-Level In-Memory Cache to provide instant partial or complete search retrieval with 0ms latency
interface DomainCacheEntry {
  timestamp: number;
  result: ScraperResult;
}

const domainQueryCache = new Map<string, DomainCacheEntry>(); // Key: `${cleanQuery}_${domain}`
const CACHE_TTL = 30 * 60 * 1000; // 30-minute Time-To-Live for cached results

/**
 * High-fidelity resilient regex-based movie/resource site extractor to capture live titles, posters and links.
 */
/**
 * High-fidelity resilient extractor to capture live titles, posters and links.
 * Works by matching img elements and searching surrounding HTML context for nearest href and headings/titles.
 */
/**
 * Evaluates whether a scraped title matches the target search query.
 * Uses smart keyword intersection and filters out common stop words to keep matching robust but accurate.
 */
function queryMatchesTitle(title: string, query: string, relaxed: boolean = false): boolean {
  if (!query || query.trim().length === 0) return true;
  
  const tClean = title.toLowerCase().trim();
  const qClean = query.toLowerCase().trim();
  
  // 1. Direct contains check (perfect match)
  if (tClean.includes(qClean)) return true;
  
  // 2. Clear out non-alphanumeric punctuation to keep strings compared cleanly
  const tAlpha = tClean.replace(/[^a-z0-9\s]/g, " ");
  const qAlpha = qClean.replace(/[^a-z0-9\s]/g, " ");
  
  if (tAlpha.includes(qAlpha)) return true;
  
  // 3. Keyword matching (ignoring standard filler/stop words)
  const stopWords = new Set([
    "the", "a", "an", "of", "and", "in", "to", "for", "on", "with", "at", "by", "from", "as", "is", "or", "it", 
    "this", "that", "dual", "hindi", "bengali", "english", "movie", "download", "remastered", "webrip", "bluray", "hdrip", "esub"
  ]);
  
  const qWords = qAlpha.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  
  if (qWords.length === 0) {
    const simpleWords = qAlpha.split(/\s+/).filter(w => w.length > 1);
    if (simpleWords.length === 0) return true; // match everything if query is completely tiny
    return simpleWords.some(w => tAlpha.includes(w));
  }
  
  // Count how many high-value query words are present in the parsed title
  const matchesCount = qWords.filter(w => tAlpha.includes(w)).length;
  
  if (qWords.length === 1) {
    return matchesCount === 1;
  }
  
  if (relaxed) {
    // Under relaxed mode, if at least 1 significant word (or 25% of compound words) matches, keep it!
    return matchesCount >= Math.max(1, Math.ceil(qWords.length * 0.25));
  }
  
  // Require at least 50% keyword matching for compound titles
  return matchesCount >= Math.ceil(qWords.length * 0.5);
}

/**
 * High-fidelity resilient extractor to capture live titles, posters and links.
 * Works by matching img elements and searching surrounding HTML context for nearest href and headings/titles.
 */
function extractScrapedItems(html: string, siteUrl: string, query: string = "", relaxed: boolean = false): { title: string; link: string; poster: string }[] {
  const items: { title: string; link: string; poster: string }[] = [];
  
  // Clean scripts, styles, comments, and SVGs that interfere with parsing
  const cleanHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Locate all <img> tags
  const imgRegex = /<img([^>]+)>/gi;
  let match;
  
  while ((match = imgRegex.exec(cleanHtml)) !== null) {
    if (items.length >= 8) break;

    const imgIndex = match.index;
    const imgAttributes = match[1];
    
    // Extract image URL from any lazy-loader or source attributes
    const srcMatch = imgAttributes.match(/(?:src|data-src|data-lazy-src|data-srcset|data-original|data-cfsrc|srcset)=["']([^"'\s<>]+)/i);
    if (!srcMatch) continue;
    
    let poster = srcMatch[1].trim();

    // Clean up srcset URL formatted list
    if (poster.includes(",")) {
      const parts = poster.split(",");
      const firstPart = parts[0].trim().split(/\s+/)[0];
      if (firstPart) poster = firstPart;
    } else if (poster.includes(" ")) {
      poster = poster.trim().split(/\s+/)[0];
    }
    
    // Filtering out layout junk images
    const posterLower = poster.toLowerCase();
    const isJunk = 
      posterLower.includes("gravatar.com") || 
      posterLower.includes("spacer") || 
      posterLower.includes("loading") || 
      posterLower.includes("blank") || 
      posterLower.includes("logo") ||
      posterLower.includes("avatar") ||
      posterLower.includes("favicon") ||
      posterLower.includes("analytics") ||
      posterLower.includes("pixel") ||
      posterLower.includes("banner") ||
      posterLower.includes("icon") ||
      posterLower.endsWith(".svg") ||
      posterLower.includes("advert") ||
      posterLower.includes("transparent");
      
    if (isJunk) continue;
    
    // Squeeze HTML context around current image (approx. 1000 chars before/after)
    const startContext = Math.max(0, imgIndex - 1000);
    const endContext = Math.min(cleanHtml.length, imgIndex + 1000);
    const context = cleanHtml.slice(startContext, endContext);
    
    // Search for nearest link: check preceding HTML text first (the standard wrapping)
    const precedingText = cleanHtml.slice(startContext, imgIndex);
    const succeedingText = cleanHtml.slice(imgIndex, endContext);
    
    let link = "";
    const hrefRegex = /href=["'](https?:\/\/[^"'\s<>]+|\/[^"'\s<>]+)/gi;
    let hrefMatch;
    const precedingHrefs: string[] = [];
    
    while ((hrefMatch = hrefRegex.exec(precedingText)) !== null) {
      precedingHrefs.push(hrefMatch[1]);
    }
    
    if (precedingHrefs.length > 0) {
      link = precedingHrefs[precedingHrefs.length - 1];
    } else {
      const forwardHrefMatch = succeedingText.match(/href=["'](https?:\/\/[^"'\s<>]+|\/[^"'\s<>]+)/i);
      if (forwardHrefMatch) {
        link = forwardHrefMatch[1];
      }
    }
    
    if (!link) continue;
    
    // Format absolute paths
    let absoluteLink = link;
    if (absoluteLink.startsWith("//")) {
      try {
        const urlObj = new URL(siteUrl);
        absoluteLink = urlObj.protocol + absoluteLink;
      } catch {
        absoluteLink = "https:" + absoluteLink;
      }
    } else if (absoluteLink.startsWith("/")) {
      try {
        const urlObj = new URL(siteUrl);
        absoluteLink = urlObj.origin + absoluteLink;
      } catch {
        absoluteLink = siteUrl.replace(/\/?$/, "") + absoluteLink;
      }
    }
    
    let absolutePoster = poster;
    if (absolutePoster.startsWith("//")) {
      try {
        const urlObj = new URL(siteUrl);
        absolutePoster = urlObj.protocol + absolutePoster;
      } catch {
        absolutePoster = "https:" + absolutePoster;
      }
    } else if (!absolutePoster.startsWith("http")) {
      try {
        const urlObj = new URL(siteUrl);
        if (absolutePoster.startsWith("/")) {
          absolutePoster = urlObj.origin + absolutePoster;
        } else {
          absolutePoster = new URL(absolutePoster, urlObj.origin).toString();
        }
      } catch {
        absolutePoster = siteUrl.replace(/\/?$/, "") + (absolutePoster.startsWith("/") ? "" : "/") + absolutePoster;
      }
    }
    
    // Retrieve Title: Prioritize alt, label, or headings inside our 2kb scan window
    let title = "";
    
    // 1. Search for alt/title values
    const altMatch = imgAttributes.match(/alt=["']([^"']+)["']/i) || imgAttributes.match(/title=["']([^"']+)["']/i);
    if (altMatch && altMatch[1].trim().length > 3) {
      title = altMatch[1].trim();
    }
    
    // 2. Search for heading elements in our localized context block
    if (!title || title.toLowerCase() === "poster" || title.toLowerCase() === "image" || title.toLowerCase().includes("thumbnail")) {
      const headingMatch = context.match(/<(?:h1|h2|h3|h4|h5|h6|strong|span)[^>]*class=[^>]*title[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4|h5|h6|strong|span)>/i) ||
                           context.match(/<(?:h1|h2|h3|h4|h5|h6|strong)[^>]*>([\s\S]*?)<\/(?:h1|h2|h3|h4|h5|h6|strong)>/i);
      if (headingMatch && headingMatch[1].replace(/<[^>]+>/g, "").trim().length > 3) {
        title = headingMatch[1].replace(/<[^>]+>/g, "").trim();
      }
    }
    
    // 3. Parse enclosing anchor text as fallback
    if (!title || title.toLowerCase() === "poster" || title.toLowerCase() === "image" || title.toLowerCase().includes("thumbnail")) {
      const anchorTextMatch = context.match(/<a[^>]*>([\s\S]*?)<\/a>/i);
      if (anchorTextMatch) {
        const innerText = anchorTextMatch[1].replace(/<[^>]+>/g, "").trim();
        if (innerText.length > 5 && !innerText.toLowerCase().includes("download") && !innerText.toLowerCase().includes("click")) {
          title = innerText;
        }
      }
    }
    
    // Polish & sanitize title string beautifully
    if (title) {
       title = title
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&#039;/gi, "'")
        .replace(/&quot;/gi, '"')
        .replace(/\s+/g, " ")
        .replace(/<[^>]+>/g, "") // Ensure all nested html spans are cleaned
        .trim();
    }
    
    const titleLower = title.toLowerCase();
    const isJunkTitle = 
      titleLower.includes("paypal") ||
      titleLower.includes("subscribe") ||
      titleLower.includes("telegram") ||
      titleLower.includes("facebook") ||
      titleLower.includes("twitter") ||
      titleLower.includes("contact") ||
      titleLower.includes("privacy");
      
    if (title && title.length > 3 && !isJunkTitle) {
      // Validate query matches title perfectly to filter out unrelated sidebars, banners or generic site images
      if (queryMatchesTitle(title, query, relaxed)) {
        if (!items.some(it => it.link === absoluteLink || it.title === title)) {
          items.push({
            title,
            link: absoluteLink,
            poster: absolutePoster
          });
        }
      }
    }
  }
  
  // 4. Robust Text Link matching Fallback: if we didn't find enough matches or poster matches were incomplete,
  // we scrape text links directly based on name queries for an exact result.
  const qClean = query.trim().toLowerCase();
  if (items.length < 8 && qClean.length >= 2) {
    const anchorRegex = /<a\b([^>]*href=["']([^"'\s<>]+)["'][^>]*)>([\s\S]*?)<\/a>/gi;
    let aMatch;
    
    while ((aMatch = anchorRegex.exec(cleanHtml)) !== null && items.length < 8) {
      const linkUrl = aMatch[2];
      const innerHtml = aMatch[3];
      
      const cleanText = innerHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const textLower = cleanText.toLowerCase();
      
      if (cleanText.length < 3 || cleanText.length > 150) continue;
      
      const isJunkText = 
        textLower.includes("paypal") ||
        textLower.includes("subscribe") ||
        textLower.includes("telegram") ||
        textLower.includes("facebook") ||
        textLower.includes("twitter") ||
        textLower.includes("contact") ||
        textLower.includes("privacy") ||
        textLower.includes("dmca") ||
        textLower.includes("disclaimer") ||
        textLower.includes("about") ||
        textLower.includes("terms") ||
        textLower.includes("home") ||
        textLower.includes("policy") ||
        textLower.includes("sitemap") ||
        textLower.includes("sign up") ||
        textLower.includes("login") ||
        textLower.includes("register") ||
        textLower.includes("bookmark") ||
        textLower.includes("share") ||
        textLower.includes("admin") ||
        textLower.includes("category") ||
        textLower.includes("tag") ||
        textLower.includes("comment") ||
        textLower.includes("download app");
        
      if (isJunkText) continue;
      
      const cleanQueryWords = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const urlHasQuery = cleanQueryWords.length > 0 && cleanQueryWords.every(w => linkUrl.toLowerCase().includes(w));
      const textHasQuery = queryMatchesTitle(cleanText, query, relaxed);
      
      if (textHasQuery || urlHasQuery) {
        let absoluteLink = linkUrl;
        if (absoluteLink.startsWith("//")) {
          try {
            const urlObj = new URL(siteUrl);
            absoluteLink = urlObj.protocol + absoluteLink;
          } catch {
            absoluteLink = "https:" + absoluteLink;
          }
        } else if (absoluteLink.startsWith("/")) {
          try {
            const urlObj = new URL(siteUrl);
            absoluteLink = urlObj.origin + absoluteLink;
          } catch {
            absoluteLink = siteUrl.replace(/\/?$/, "") + absoluteLink;
          }
        }
        
        // Filter out catalog filters or assets disguised as actual articles
        const linkLower = absoluteLink.toLowerCase();
        const isJunkLink = 
          linkLower.endsWith(".png") || 
          linkLower.endsWith(".jpg") || 
          linkLower.endsWith(".jpeg") || 
          linkLower.includes("/tag/") || 
          linkLower.includes("/category/") || 
          linkLower.includes("contact") || 
          linkLower.includes("privacy");
          
        if (isJunkLink) continue;
        
        // Synthesize title if cleanText is empty, too short, or generic (like Play / Watch / Download)
        let displayTitle = cleanText;
        if (!textHasQuery && urlHasQuery && (cleanText.length < 3 || /^(play|download|watch|click|link|mirror|file|open|more|read|view|here)/i.test(cleanText))) {
          const slugParts = linkUrl.split('/');
          const slug = slugParts[slugParts.length - 1] || slugParts[slugParts.length - 2] || "";
          if (slug) {
            displayTitle = slug
              .replace(/[-_]+/g, " ")
              .replace(/\b[a-z]/g, (char) => char.toUpperCase())
              .trim();
          }
        }
        
        if (!displayTitle || displayTitle.length < 3) {
          displayTitle = query.trim();
        }

        if (!items.some(it => it.link === absoluteLink || it.title.toLowerCase() === displayTitle.toLowerCase())) {
          items.push({
            title: displayTitle,
            link: absoluteLink,
            poster: "" // Beautiful TMDB / entity fallback poster container on the client-side
          });
        }
      }
    }
  }
  
  return items;
}

export async function scrapeQuery(
  query: string, 
  options?: { domains?: string[]; category?: string },
  onResult?: (result: ScraperResult) => void
): Promise<ScraperResult[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  let providersToCheck = SEARCH_PROVIDERS;

  // Filter based on options
  if (options?.domains && options.domains.length > 0) {
    const list = options.domains;
    providersToCheck = SEARCH_PROVIDERS.filter(p => list.includes(p.domain));
  } else if (options?.category && options.category !== "all") {
    const cat = options.category;
    providersToCheck = SEARCH_PROVIDERS.filter(p => p.category === cat);
  }

  const results: ScraperResult[] = [];
  const providersToFetch: typeof SEARCH_PROVIDERS = [];

  const now = Date.now();

  // Instant Cache Response Check - Check each domain individually
  providersToCheck.forEach(provider => {
    const key = `${cleanQuery}_${provider.domain}`;
    const cached = domainQueryCache.get(key);
    if (cached && (now - cached.timestamp < CACHE_TTL)) {
      results.push(cached.result);
      if (onResult) {
        onResult(cached.result);
      }
    } else {
      providersToFetch.push(provider);
    }
  });

  if (providersToFetch.length > 0) {
    const BATCH_SIZE = 100;
    for (let i = 0; i < providersToFetch.length; i += BATCH_SIZE) {
      if (i > 0) {
        // Stagger to prevent CPU/Network spikes
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      const batch = providersToFetch.slice(i, i + BATCH_SIZE);
      
      const batchPromises = batch.map(async (provider) => {
        const fullUrl = provider.getSearchUrl(query.trim()); // Original casing preserved for standard search
        
        // Safe 6.0s limit to handle slow self-hosted or international indices safely
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const startTime = Date.now();

        try {
          const response = await fetch(fullUrl, {
            signal: controller.signal as any,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Referer": provider.url
            }
          });

          const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
          clearTimeout(timeoutId);

          if (!response.ok) {
            return {
              providerName: provider.name,
              domain: provider.domain,
              status: "error" as const,
              searchUrl: fullUrl,
              message: `HTTP ${response.status}`,
              responseTime
            };
          }

          const text = await response.text();
          
          // Comprehensive text matches matching common empty layout states on sites
          const noResultsRegexes = [
            /no\s+results?\s+found/i,
            /nothing\s+found/i,
            /not\s+found\b/i,
            /sorry,\s*(but\s*)?nothing\s+matched/i,
            /\b0\s+matching\b/i,
            /\b0\s+results\b/i,
            /no\s+posts?\s+found/i,
            /can't\s+find/i,
            /try\s+checking?\s+spelling/i,
            /class=["'](?:not-found|no-results|search-no-results)["']/i,
            /id=["'](?:not-found|no-results)["']/i,
            /no\s+matches\s+found/i,
            /no-results-found/i,
            /search\s+results\s+for:\s+0\b/i,
            /did\s+not\s+match\s+any\s+documents/i,
            /\b0\s+matches\s+found/i,
            /nothing\s+matched\s+your\s+search/i,
            /no\s+results\s+matching/i,
            /no\s+search\s+results/i,
            /there\s+are\s+no\s+posts/i,
            /\bno\s+matches\b/i,
            /search\s+returned\s+0\s+results/i,
            /404\s+-\s+not\s+found/i,
            /empty\s+result/i,
            /nothing\s+here/i,
            /sorry,\s*no\s+results/i,
            /no\s+items?\s+found/i
          ];

          // Clean & Parse actual matched movie titles and posters directly from web source first
          let scrapedItems = extractScrapedItems(text, provider.url, query.trim(), false);

          // If strict matching yielded 0 elements, retry under relaxed keywords matching to catch any missing matches!
          if (scrapedItems.length === 0) {
            scrapedItems = extractScrapedItems(text, provider.url, query.trim(), true);
          }

          if (scrapedItems.length > 0) {
            return {
              providerName: provider.name,
              domain: provider.domain,
              status: "success" as const,
              searchUrl: fullUrl,
              message: `Source is healthy and matched ${scrapedItems.length} items.`,
              responseTime,
              scrapedItems
            };
          }

          // Check for explicit "not found" text patterns only if our parser produced 0 items
          const isNoResults = noResultsRegexes.some(regex => regex.test(text));
          
          // Fallback: If page text contains the significant query words and doesn't explicitly match "not found" regexes,
          // then the site has items inside! We synthesize a direct index response item.
          const cleanQueryWords = query.trim().toLowerCase().split(/\s+/).filter(w => w.length > 2);
          const hasSignificantKeywords = cleanQueryWords.length > 0 && cleanQueryWords.every(word => text.toLowerCase().includes(word));
          
          if (hasSignificantKeywords && !isNoResults) {
            return {
              providerName: provider.name,
              domain: provider.domain,
              status: "success" as const,
              searchUrl: fullUrl,
              message: `Source has matched elements via text indexing.`,
              responseTime,
              scrapedItems: [{
                title: `${query.trim()} (Source Index)`,
                link: fullUrl,
                poster: ""
              }]
            };
          }

          return {
            providerName: provider.name,
            domain: provider.domain,
            status: "no_results" as const,
            searchUrl: fullUrl,
            message: isNoResults ? "Filtered: Zero matched elements found on host." : "No structured anchors or media matched search criteria.",
            responseTime
          };
        } catch (err: any) {
          const responseTime = Number(((Date.now() - startTime) / 1000).toFixed(2));
          clearTimeout(timeoutId);
          const isTimeout = err.name === "AbortError" || err.message?.includes("aborted");
          return {
            providerName: provider.name,
            domain: provider.domain,
            status: "error" as const,
            searchUrl: fullUrl,
            message: isTimeout ? "Request Terminated: Service Timed Out" : err.message || "Failed to make connection",
            responseTime
          };
        }
      });

      const batchOutputs = await Promise.allSettled(batchPromises);

      batchOutputs.forEach((out, index) => {
        const provider = batch[index];
        let resEntry: ScraperResult;

        if (out.status === "fulfilled") {
          resEntry = out.value;
        } else {
          resEntry = {
            providerName: provider.name,
            domain: provider.domain,
            status: "error" as const,
            searchUrl: provider.getSearchUrl(query.trim()),
            message: out.reason?.message || "Internal scrape routing rejected",
            responseTime: 2.0
          };
        }

        // Save into domain query cache
        domainQueryCache.set(`${cleanQuery}_${provider.domain}`, {
          timestamp: Date.now(),
          result: resEntry
        });

        if (onResult) {
          onResult(resEntry);
        }

        results.push(resEntry);
      });
    }
  }

  return results;
}

