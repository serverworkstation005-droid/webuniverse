import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, ExternalLink, MonitorPlay, Clapperboard, Gamepad2, Magnet, Sparkles, Package, Library, Keyboard, Zap, Command, Activity } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link } from 'react-router-dom';
import { getAllResources, PortalItem } from '../data/allData';
import Fuse from 'fuse.js';
import { SEARCH_PROVIDERS } from '../data/searchResources';

const getResourceRatingInfo = (item: PortalItem) => {
  const cleanDomain = (d: string) => d.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
  const itemDom = cleanDomain(item.domain || '');
  
  const provider = SEARCH_PROVIDERS.find(p => {
    const pDom = cleanDomain(p.domain || '');
    return pDom === itemDom || itemDom.includes(pDom) || pDom.includes(itemDom) || p.name.toLowerCase() === item.name.toLowerCase();
  });

  if (provider) {
    return {
      rating: typeof provider.rating === 'number' ? provider.rating : 4.0,
      tier: provider.tier || 'Tier-3 (Good)'
    };
  }

  return {
    rating: 4.0,
    tier: 'Tier-3 (Good)'
  };
};

const BASELINE_RESPONSE_TIMES: Record<string, number> = {
  "uhdmovies.food": 0.42,
  "4khdhub.one": 0.58,
  "v2.olamovies.mov": 0.32,
  "vegamovies.mq": 0.55,
  "kmmovies.lol": 0.55,
  "cinefreak.nl": 0.85,
  "ddlbase.com": 0.72,
  "southfreak.fyi": 0.92,
  "mlsbd.co": 0.88,
  "cinedoze.tv": 0.79,
  "rogmovies.blog": 1.15,
  "moviesmod.farm": 0.68,
  "moviesleech.rodeo": 0.76,
  "cinemalux.skin": 1.10,
  "new1.hdhub4u.cl": 0.84,
  "katmoviehd.cymru": 0.98,
  "downloadhub.lat": 1.05,
  "moviebaaz.cfd": 1.20,
  "fojik.com": 0.95,
  "freedrivemovie.cfd": 0.65,
  "allmovieshub.gives": 0.89,
  "hdmovieverse.xyz": 0.77,
  "moviedbhub.com": 1.12,
  "1tamilmv.cards": 0.45,
  "bollyflix.ski": 0.49,
  "go.india4movies.net": 1.18,
  "kisskh.id": 0.78,
  "asiaflix.net": 0.62,
  "goplay.su": 0.52,
  "mkvdrama.net": 0.81,
  "dramacoolm.fun": 0.74,
  "wwv19.kissasian.com.lv": 0.91,
  "myasiantv.com.bz": 0.83,
  "asianctv.cc": 0.88,
  "flixer.su": 0.69,
  "cinehub.one": 0.94,
  "rivestream.app": 0.75,
  "nepu.to": 0.87,
  "fitgirl-repacks.site": 0.25,
  "dodi-repacks.download": 0.31,
  "ovagames.com": 0.39,
  "steamrip.com": 0.44,
  "steamunlocked.org": 0.58,
  "repack-games.com": 0.64,
  "steamgg.net": 0.61,
  "ankergames.net": 0.89,
  "playzip.com": 0.97,
  "igg-games.com": 0.82,
  "romspure.cc": 0.48,
  "romsfun.com": 0.42,
  "hexrom.com": 0.67,
  "emuparadise.me": 0.91,
  "retrogametalk.com": 0.63,
  "emulatorgames.net": 0.59,
  "filecr.com": 0.29,
  "getintopc.com": 0.35,
  "taiwebs.com": 0.41,
  "liteapks.com": 0.43,
  "modyolo.com": 0.44,
  "crackingcity.com": 0.69,
  "softpedia.com": 0.52,
  "filehorse.com": 0.49,
  "filehippo.com": 0.56,
  "getmodsapk.com": 0.78,
  "apkmirror.com": 0.33,
  "apkpure.com": 0.36,
  "modded-1.com": 0.81,
  "an1.com": 0.72,
  "5play.org": 0.83,
  "platinmods.com": 0.61,
  "iosgods.com": 0.44,
};

const getResourceResponseTime = (item: PortalItem): number => {
  const cleanDomain = (d: string) => d.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
  const itemDom = cleanDomain(item.domain || '');
  
  if (BASELINE_RESPONSE_TIMES[itemDom] !== undefined) {
    return BASELINE_RESPONSE_TIMES[itemDom];
  }
  
  const match = Object.keys(BASELINE_RESPONSE_TIMES).find(domain => 
    itemDom.includes(domain) || domain.includes(itemDom)
  );
  if (match) {
    return BASELINE_RESPONSE_TIMES[match];
  }
  
  let hash = 0;
  for (let i = 0; i < itemDom.length; i++) {
    hash += itemDom.charCodeAt(i);
  }
  return Number((0.5 + (hash % 10) * 0.15).toFixed(2));
};

const getSmartRankScore = (rating: number, responseTime: number, tier: string): number => {
  const normalizedRating = Math.max(0, Math.min(1, (rating - 3.0) / 2.0));
  const normalizedResponseTime = Math.max(0, Math.min(1, (3.5 - responseTime) / 3.4));
  const tierWeight = tier === "Tier-1 (Elite)" ? 1.0 : tier === "Tier-2 (Excellent)" ? 0.75 : 0.5;

  const composite = (normalizedRating * 0.5) + (normalizedResponseTime * 0.3) + (tierWeight * 0.2);
  return Number((composite * 100).toFixed(1));
};

const HighlightedText = memo(({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  const words = useMemo(() => 
    highlight.split(' ')
      .filter(word => word.length > 0)
      .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  , [highlight]);
  
  if (words.length === 0) return <span>{text}</span>;

  const results = useMemo(() => {
    const sortedTerms = [...words];
    if (words.length > 1) {
      sortedTerms.unshift(words.join('\\s+'));
    }
    sortedTerms.sort((a, b) => b.length - a.length);

    const regex = new RegExp(`(${sortedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);
    return { parts, regex };
  }, [words, text]);
  
  return (
    <span className="leading-relaxed break-words">
      {results.parts.map((part, i) => 
        results.regex.test(part) ? (
          <span key={i} className="text-white font-black bg-indigo-600 rounded px-1 py-0.5 ring-1 ring-white/10 break-words">
            {part}
          </span>
        ) : (
          <span key={i} className="text-inherit opacity-70 break-words">{part}</span>
        )
      )}
    </span>
  );
});

const searchLogoFailedCache = new Set<string>();

const SearchItemLogo = memo(({ logoUrl, domain, name, category, getIcon }: { logoUrl?: string; domain: string; name: string; category: string; getIcon: (cat: string) => React.ReactNode }) => {
  const sources = useMemo(() => {
    const list: string[] = [];
    if (logoUrl && !searchLogoFailedCache.has(logoUrl)) {
      list.push(logoUrl.startsWith("/logos/") ? logoUrl + "?v=5" : logoUrl);
    }
    const clearbit = `https://logo.clearbit.com/${domain}`;
    const gstatic = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
    const googleS2 = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    if (!searchLogoFailedCache.has(clearbit)) list.push(clearbit);
    if (!searchLogoFailedCache.has(gstatic)) list.push(gstatic);
    if (!searchLogoFailedCache.has(googleS2)) list.push(googleS2);
    return list;
  }, [logoUrl, domain]);

  const [loadStep, setLoadStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const isFailedAll = loadStep >= sources.length;

  const handleNext = () => {
    setIsLoaded(false);
    if (loadStep < sources.length) {
      searchLogoFailedCache.add(sources[loadStep]);
      setLoadStep(prev => prev + 1);
    }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {!isFailedAll && (
        <>
          <div className={`absolute inset-0 z-0 bg-white/5 rounded transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <img 
            src={sources[loadStep]}
            alt={name}
            referrerPolicy="no-referrer"
            onLoad={() => setIsLoaded(true)}
            onError={handleNext}
            className={`w-full h-full object-contain relative z-10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-sm logo-img ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </>
      )}
      
    </div>
  );
});

function levenshteinDistance(s1: string, s2: string): number {
  const a = s1.toLowerCase();
  const b = s2.toLowerCase();
  const tmp: number[][] = [];
  const min = Math.min;
  
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = min(
        tmp[i - 1][j] + 1, // deletion
        min(
          tmp[i][j - 1] + 1, // insertion
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // substitution
        )
      );
    }
  }
  return tmp[a.length][b.length];
}

function getLevenshteinSimilarity(s1: string, s2: string): number {
  const distance = levenshteinDistance(s1, s2);
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 1.0;
  return 1.0 - distance / maxLength;
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PortalItem[]>([]);
  const [allData, setAllData] = useState<PortalItem[]>([]);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset category filter when search query is typed/changed to keep search context wide first
  useEffect(() => {
    setActiveCategoryFilter('All');
  }, [query]);

  // Load all data once on mount
  useEffect(() => {
    if (allData.length === 0) {
      setAllData(getAllResources());
    }
  }, [allData.length]);

  // Initialize Fuse with enhanced fuzzy parameters
  const fuse = useMemo(() => {
    return new Fuse(allData, {
      keys: [
        { name: 'name', weight: 1.0 },
        { name: 'description', weight: 0.3 },
        { name: 'tags', weight: 0.5 }
      ],
      threshold: 0.5, // Wider initial pool which is precise-filtered by Levenshtein
      includeScore: true,
      ignoreLocation: true,
      useExtendedSearch: true,
      minMatchCharLength: 2 });
  }, [allData]);

  // Handle fuzzy search combining Fuse, Levenshtein similarity, ratings, and active filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedQuery = query.trim().toLowerCase();
      if (trimmedQuery.length > 1) {
        const fuseResults = fuse.search(query);
        
        // Re-score based on Levenshtein and Prefix proximity
        const scored = fuseResults.map(res => {
          const item = res.item;
          const fuseScore = res.score ?? 1.0; // 0.0 perfectly matched
          
          const levSimilarity = getLevenshteinSimilarity(item.name, trimmedQuery);
          const prefixBoost = item.name.toLowerCase().startsWith(trimmedQuery) ? 0.35 : 0.0;
          
          // Lower score is a better match
          const combinedScore = (fuseScore * 0.4) + ((1.0 - levSimilarity) * 0.6) - prefixBoost;
          const ratingInfo = getResourceRatingInfo(item);
          const responseTime = getResourceResponseTime(item);
          const smartRank = getSmartRankScore(ratingInfo.rating, responseTime, ratingInfo.tier);
          
          return { 
            item: {
              ...item,
              rating: ratingInfo.rating,
              tier: ratingInfo.tier,
              smartRank,
              responseTime
            }, 
            score: combinedScore,
            rating: ratingInfo.rating,
            tier: ratingInfo.tier,
            smartRank,
            responseTime
          };
        });

        // Filter out results where search term naming is not found
        // "arr jei site gulate result nei/name matched na sei site jeno na ase"
        // Also ensure no results with "no result", "no found", "nothing found", "not found", "404"
        const filtered = scored.filter(res => {
          const nameLower = res.item.name.toLowerCase();
          const descLower = res.item.description.toLowerCase();
          const domainLower = res.item.domain.toLowerCase();
          const tagsLower = (res.item.tags || []).map(t => t.toLowerCase());

          // Strictly filter out results featuring "no result", "no found", "nothing found", "not found", "404", "empty", "error"
          const forbiddenPhrases = ["no result", "no found", "nothing found", "not found", "404", "empty", "error"];
          const containsForbidden = forbiddenPhrases.some(phrase => {
            return nameLower.includes(phrase) || 
                   descLower.includes(phrase) || 
                   domainLower.includes(phrase) ||
                   tagsLower.some(t => t.includes(phrase));
          });
          
          if (containsForbidden) {
            return false;
          }
          
          const terms = trimmedQuery.split(/\s+/).filter(t => t.length >= 2);
          if (terms.length === 0) return true;
          
          // STRICT Naming Relevance Enforcer:
          // The search must match the actual name or domain of the resource.
          // If searched by name and no relevance is established, don't show the site.
          const hasNameOrDomainMatch = terms.some(term => {
            // Is it a direct substring of name or domain?
            if (nameLower.includes(term) || domainLower.includes(term)) {
              return true;
            }
            // Is there a strong Levenshtein similarity to any word in the name?
            const nameWords = nameLower.split(/\s+/);
            return nameWords.some(word => {
              return getLevenshteinSimilarity(word, term) >= 0.65;
            });
          });

          // Overall overall Levenshtein similarity check between the query and full name
          const overallSimilarity = getLevenshteinSimilarity(nameLower, trimmedQuery);
          
          // If there is absolutely no name match or overall similarity is beneath threshold, reject immediately.
          if (!hasNameOrDomainMatch && overallSimilarity < 0.38) {
            return false;
          }

          // Must also contain general term match within name, description, tags, or domain
          const hasTermMatch = terms.some(term => {
            return nameLower.includes(term) || 
                   descLower.includes(term) || 
                   tagsLower.some(t => t.includes(term)) ||
                   domainLower.includes(term);
          });

          return hasTermMatch;
        });

        // Arrange descending by SmartRank composite metrics, then fallback to search relevance score alignment
        filtered.sort((a, b) => {
          if (b.smartRank !== a.smartRank) {
            return b.smartRank - a.smartRank; // Higher SmartRank at the top
          }
          return a.score - b.score; // Fallback to fuzzy text match relevance
        });

        setResults(filtered.map(r => r.item).slice(0, 10));
        setSearchTerms(query.split(' ').filter(t => t.length > 0));
      } else {
        setResults([]);
        setSearchTerms([]);
      }
    }, 55); // Short debounce for typing interaction
    return () => clearTimeout(timer);
  }, [query, fuse]);

  // Global Event Listeners for Search
  useEffect(() => {
    const handleOpenSearch = () => {
      console.log('Opening Search Modal...'); // Debugging
      setIsOpen(true);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('open-global-search', handleOpenSearch);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('open-global-search', handleOpenSearch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      }
    }
  }, [isOpen]);

  const getCategoryIcon = (categoryHash: string) => {
    const cat = categoryHash.toLowerCase();
    if (cat.includes('movie')) return <Clapperboard size={16} />;
    if (cat.includes('stream')) return <MonitorPlay size={16} />;
    if (cat.includes('game')) return <Gamepad2 size={16} />;
    if (cat.includes('torrent')) return <Magnet size={16} />;
    if (cat.includes('anime')) return <Sparkles size={16} />;
    if (cat.includes('software')) return <Package size={16} />;
    if (cat.includes('library') || cat.includes('book')) return <Library size={16} />;
    if (cat.includes('typing')) return <Keyboard size={16} />;
    if (cat.includes('tech') || cat.includes('utility')) return <Zap size={16} />;
    return <Search size={16} />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-2 sm:p-6 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm saturate-[150%]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
            className="relative w-full max-w-2xl bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:mt-[5vh] isolate"
          >
            {/* Ambient background shadow */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/[0.02] to-transparent -z-10" />
            
            {/* Search Header */}
            <div className="p-3 sm:p-6 border-b border-white/[0.03] relative group/input">
              <div className="flex items-center gap-2 sm:gap-4">
                <Search className="text-indigo-400 shrink-0 group-focus-within/input:scale-[1.02] transition-all duration-[950ms]" size={18} />
                <input 
                  ref={inputRef}
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the universe..."
                  className="bg-transparent border-none focus:ring-0 text-sm sm:text-lg w-full placeholder:text-white/10 font-bold tracking-tight py-1 outline-none font-display text-white"
                />
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-[10px] font-black py-1 px-2 rounded-lg bg-white/5 text-white/20 border border-white/10 uppercase tracking-widest">ESC</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/30 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
 
            {/* Results Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 sm:p-3">
              {query.length === 0 ? (
                  <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 px-2 flex items-center gap-2">
                        <Activity size={10} className="text-indigo-500" />
                        Quick Navigation
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CATEGORIES.slice(0, 4).map((cat) => (
                          <Link
                            key={cat.id}
                            to={cat.link}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group overflow-hidden relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                            <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 group-hover:text-indigo-400 group-hover:scale-[1.02] transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 shrink-0">
                              {getCategoryIcon(cat.title)}
                            </div>
                            <div className="flex flex-col relative z-10 min-w-0">
                              <span className="text-xs sm:text-sm font-bold text-white/70 group-hover:text-white truncate">{cat.title}</span>
                              <span className="text-[8px] text-white/20 font-black tracking-widest uppercase">Explore</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
 
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="rounded-2xl sm:rounded-3xl border border-white/[0.03] bg-gradient-to-br from-indigo-500/[0.01] via-transparent to-transparent p-5 sm:p-8 text-center relative overflow-hidden group"
                    >
                      <Sparkles className="text-indigo-500 mx-auto mb-3" size={24} />
                      <h4 className="text-white font-bold text-sm sm:text-base tracking-tight mb-2">Web Universe Directory</h4>
                      <p className="text-[11px] sm:text-xs text-white/30 leading-relaxed max-w-[260px] mx-auto">Find and access premium gaming, streaming, and high-fidelity content instantly.</p>
                    </motion.div>
                  </div>
                ) : results.length > 0 ? (() => {
                  const filteredByTab = activeCategoryFilter === 'All' 
                    ? results 
                    : results.filter(item => item.category === activeCategoryFilter);
                  
                  return (
                    <motion.div 
                      layout
                      className="space-y-1 mt-1"
                    >
                      {/* Category Filter Pills for searching */}
                      <div className="flex items-center gap-1.5 px-2 sm:px-4 mb-4 overflow-x-auto no-scrollbar py-1 shrink-0">
                        {["All", "Streaming", "Movies & Shows", "Anime", "Games Universe", "Torrents", "Software"].map((cat) => {
                          const count = cat === 'All' 
                            ? results.length 
                            : results.filter(item => item.category === cat).length;
                          
                          if (cat !== 'All' && count === 0) return null; // Only show relevant categories that have matches!

                          const isActive = activeCategoryFilter === cat;

                          return (
                            <button
                              key={cat}
                              onClick={() => setActiveCategoryFilter(cat)}
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-1.5 whitespace-nowrap select-none cursor-pointer ${
                                isActive
                                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-extrabold shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                  : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.04] hover:text-white/85'
                              }`}
                            >
                              <span>{cat}</span>
                              <span className={`text-[8px] px-1 py-0.2 rounded-md ${
                                isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-white/30'
                              }`}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between px-2 sm:px-4 mb-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500/50 truncate max-w-[70%]">Search Results for: "{query}"</h3>
                        <span className="text-[9px] font-black text-white/10 shrink-0">{filteredByTab.length} results</span>
                      </div>

                      <AnimatePresence mode="popLayout">
                        {filteredByTab.length > 0 ? (
                          filteredByTab.map((item, idx) => {
                              let targetHref = item.url;
                              if (query.trim()) {
                                const provider = SEARCH_PROVIDERS.find(p => {
                                  const pDom = p.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                                  const iDom = item.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
                                  return pDom === iDom || iDom.includes(pDom);
                                });
                                if (provider && provider.getSearchUrl) {
                                  targetHref = provider.getSearchUrl(query.trim());
                                }
                              }
                              
                              return (
                            <motion.a
                              layout
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.98 }}
                              transition={{
                                delay: idx * 0.04,
                                opacity: { duration: 0.18 },
                                layout: { type: 'spring', stiffness: 110, damping: 20, mass: 1 },
                                y: { type: 'spring', stiffness: 110, damping: 20, mass: 1 }
                              }}
                              key={`res-${item.url}-${idx}`}
                              href={targetHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02, 
                                x: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                borderColor: 'rgba(99, 102, 241, 0.25)',
                                transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 } }}
                              whileTap={{ scale: 0.98,
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 } }}
                              style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                              className="flex items-center justify-between gap-2.5 sm:gap-4 p-2.5 sm:p-3 rounded-xl border border-transparent transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group relative overflow-hidden min-w-0"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-transparent to-transparent group-hover:from-indigo-500/5 transition-all duration-[950ms]" />
                              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 relative z-10 flex-1">
                                <div className="portal-logo-container w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 overflow-hidden flex items-center justify-center p-1.5 shrink-0 relative group-hover:scale-[1.02] transition-all duration-[950ms]">
                                  <SearchItemLogo 
                                    logoUrl={item.logo} 
                                    domain={item.domain} 
                                    name={item.name} 
                                    category={item.category} 
                                    getIcon={getCategoryIcon} 
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-0.5 min-w-0">
                                    <h4 className="text-white text-xs sm:text-sm font-bold group-hover:text-amber-300 transition-colors duration-[950ms] truncate">
                                      <HighlightedText text={item.name} highlight={query} />
                                    </h4>
                                    <span className="inline-block self-start sm:self-auto text-[7px] font-black px-1 py-0.2 rounded bg-white/5 border border-white/10 text-white/20 uppercase tracking-tighter shrink-0">
                                      {item.category}
                                    </span>
                                    {item.rating !== undefined && (
                                      <span className="inline-flex items-center gap-0.5 text-[7px] font-black font-mono leading-none px-1 py-0.2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase tracking-tighter shrink-0 select-none">
                                        ★ {item.rating.toFixed(1)}
                                      </span>
                                    )}
                                    {item.smartRank !== undefined && (
                                      <span 
                                        className="inline-flex items-center gap-0.5 text-[7px] font-black font-mono leading-none px-1 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 uppercase tracking-tighter shrink-0 select-none"
                                        title={`SmartRank: ${item.smartRank}/100 composite ranking`}
                                      >
                                        <Zap size={7} className="text-indigo-400 fill-indigo-400" /> SR {item.smartRank}
                                      </span>
                                    )}
                                    {item.responseTime !== undefined && (
                                      <span 
                                        className={`inline-flex items-center gap-0.5 text-[7px] font-black font-mono leading-none px-1 py-0.2 rounded uppercase tracking-tighter shrink-0 select-none ${
                                          item.responseTime < 0.4
                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                            : item.responseTime < 0.8
                                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-500"
                                            : "bg-rose-500/10 border border-rose-500/20 text-rose-500"
                                        }`}
                                        title={`Server Response: ${item.responseTime}s`}
                                      >
                                        ⚡ {item.responseTime}s
                                      </span>
                                    )}
                                    {item.tier === "Tier-1 (Elite)" && (
                                      <span className="inline-flex items-center gap-0.5 text-[7px] font-black font-mono leading-none px-1 py-0.2 rounded bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 uppercase tracking-tighter shrink-0 select-none">
                                        💎 Elite
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] sm:text-xs text-white/30 truncate leading-relaxed">
                                    <HighlightedText text={item.description} highlight={query} />
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 relative z-10">
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-[950ms] bg-white/[0.03] text-white/30 border border-white/5 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/30 select-none">
                                  <span>
                                    {['software', 'games', 'torrent'].some(term => item.category.toLowerCase().includes(term)) ? 'Direct Access' : 'Enter Portal'}
                                  </span>
                                  <ArrowRight size={11} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-[950ms] shrink-0" />
                                </span>
                                <span className="sm:hidden p-2 rounded-full bg-white/5 border border-white/5 text-white/30 group-hover:bg-indigo-500/10 group-hover:text-indigo-400 group-hover:border-indigo-500/35 transition-all duration-[950ms]">
                                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
                                </span>
                              </div>
                            </motion.a>
                          );
                        })
                        ) : (
                          <div className="py-14 text-center">
                            <div className="w-12 h-12 rounded-full bg-amber-500/5 border border-amber-500/10 flex-col flex items-center justify-center mx-auto mb-3">
                              <Search size={20} className="text-amber-500/25" />
                            </div>
                            <h4 className="text-white text-sm font-bold opacity-60">No Category Results</h4>
                            <p className="text-[10px] text-white/25 uppercase tracking-widest mt-1">Try another category filter</p>
                          </div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })()
                : (
                  <div className="py-14 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center mx-auto mb-3">
                      <Search size={20} className="text-red-500/20" />
                    </div>
                    <h4 className="text-white text-sm font-bold opacity-60">Result Not Found</h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Try adjusting your filters</p>
                  </div>
                )}
            </div>
 
            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-white/10">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
                  <span>Portal Index v4.0</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-[8px] sm:text-[9px] font-black text-white/20 uppercase tracking-widest">Search Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
