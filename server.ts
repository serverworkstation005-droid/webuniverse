import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { jsonrepair } from "jsonrepair";
import { scrapeQuery } from "./server/scraper";
import { GoogleCustomSearchService } from "./server/GoogleCustomSearchService";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Search Cache for ultra-fast, repeated performance and rate-limit prevention
const apiSearchCache = new Map<string, { timestamp: number; data: any }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes of caching

function getSearchCache(key: string): any | null {
  const cached = apiSearchCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return cached.data;
  }
  return null;
}

function setSearchCache(key: string, data: any): void {
  apiSearchCache.set(key, { timestamp: Date.now(), data });
}

// Fetch helper with retry behavior, specifically prioritizing 429 Rate Limits
async function fetchWithRetry(
  url: string, 
  headers: Record<string, string> = {}, 
  retries = 2, 
  baseDelay = 300,
  failFastOn429 = false
): Promise<Response> {
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        // Backoff delay before retry
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
      }
      const response = await fetch(url, { headers });
      if (response.status === 429) {
        if (failFastOn429) {
           throw new Error(`Status 429: Too Many Requests`);
        }
        lastError = new Error(`Status 429: Too Many Requests`);
        continue; // Retry on 429
      }
      return response;
    } catch (err: any) {
      if (err.message === "Status 429: Too Many Requests" && failFastOn429) {
        throw err;
      }
      lastError = err;
    }
  }
  throw lastError || new Error(`Failed after ${retries} retries`);
}

// Resilient fallback generators using our pre-trained server-side LLM knowledge base
/**
 * Clean & resilient JSON parser that strips markdown wrappers and cleans up internal raw newlines or format issues
 */
function cleanAndParseJSON(rawStr: string): any {
  if (!rawStr) return [];
  let cleaned = rawStr.trim();
  
  // Strip markdown code block wrappers if any
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
  }
  
  try {
    return JSON.parse(cleaned);
  } catch (initialError) {
    try {
      // Try to repair the JSON (fixes truncated JSON, unescaped newlines, missing quotes)
      const repaired = jsonrepair(cleaned);
      return JSON.parse(repaired);
    } catch {
      // If still fails, throw original parsing error to trigger fallback handling gracefully
      throw initialError;
    }
  }
}

const OFFLINE_GAMES = [
  {
    title: "The Legend of Zelda: Tears of the Kingdom",
    keywords: ["zelda", "tears", "kingdom", "link", "hyrule", "breath", "wild", "nintendo"],
    overview: "An epic adventure across the land and skies of Hyrule. Sequel to Breath of the Wild, featuring creative crafting and fusion mechanics.",
    release_date: "2023-05-12",
    platforms: ["Nintendo Switch"],
    site_detail_url: "https://www.giantbomb.com/the-legend-of-zelda-tears-of-the-kingdom/3030-79883/"
  },
  {
    title: "Elden Ring",
    keywords: ["elden", "ring", "fromsoftware", "souls", "tarnished", "malenia"],
    overview: "A massive dark fantasy action-RPG set in the Lands Between, created by Hidetaka Miyazaki and George R. R. Martin.",
    release_date: "2022-02-25",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "PlayStation 4", "Xbox One"],
    site_detail_url: "https://www.giantbomb.com/elden-ring/3030-73727/"
  },
  {
    title: "Grand Theft Auto V",
    keywords: ["gta", "gta5", "grand", "theft", "auto", "rockstar", "trevor", "michael", "franklin"],
    overview: "An open world action-adventure game set in San Andreas. Follow three criminals trying to pull off high-stakes heists.",
    release_date: "2013-09-17",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "PlayStation 4", "Xbox One", "PlayStation 3"],
    site_detail_url: "https://www.giantbomb.com/grand-theft-auto-v/3030-20593/"
  },
  {
    title: "Grand Theft Auto VI",
    keywords: ["gta6", "vice", "city", "lucia", "jason", "gta 6", "gta vi"],
    overview: "Welcome to Leonida, home to Vice City. The upcoming generation-defining entry to the Grand Theft Auto series from Rockstar Games.",
    release_date: "2025-10-31",
    platforms: ["PlayStation 5", "Xbox Series S/X"],
    site_detail_url: "https://www.giantbomb.com/grand-theft-auto-vi/3030-81119/"
  },
  {
    title: "Minecraft",
    keywords: ["minecraft", "steve", "creeper", "sandbox", "craft", "blocks"],
    overview: "A 3D sandbox game about placing blocks and going on adventures. Explore infinite worlds and build anything you can imagine.",
    release_date: "2011-11-18",
    platforms: ["PC", "Nintendo Switch", "PlayStation 4", "Xbox One", "Mobile"],
    site_detail_url: "https://www.giantbomb.com/minecraft/3030-30475/"
  },
  {
    title: "Cyberpunk 2077",
    keywords: ["cyberpunk", "cd projekt", "v", "night city", "keanu", "phantom", "liberty"],
    overview: "An open-world, action-adventure RPG set in the megacity of Night City, where you play as a cyberpunk mercenary wrapped in a fight for survival.",
    release_date: "2020-12-10",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "PlayStation 4", "Xbox One"],
    site_detail_url: "https://www.giantbomb.com/cyberpunk-2077/3030-38456/"
  },
  {
    title: "Red Dead Redemption 2",
    keywords: ["red", "dead", "redemption", "rdr2", "arthur", "morgan", "western", "cowboy", "rockstar"],
    overview: "An epic tale of life in America's unforgiving heartland. Arthur Morgan and the Van der Linde gang flee across federal agents and bounty hunters.",
    release_date: "2018-10-26",
    platforms: ["PC", "PlayStation 4", "Xbox One"],
    site_detail_url: "https://www.giantbomb.com/red-dead-redemption-ii/3030-56450/"
  },
  {
    title: "The Witcher 3: Wild Hunt",
    keywords: ["witcher", "geralt", "wild", "hunt", "ciri", "yennefer", "rpg"],
    overview: "Play as professional monster slayer Geralt of Rivia, embarked on a quest to find the child of prophecy in a vast, war-torn fantasy world.",
    release_date: "2015-05-19",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "Nintendo Switch", "PlayStation 4", "Xbox One"],
    site_detail_url: "https://www.giantbomb.com/the-witcher-3-wild-hunt/3030-41484/"
  },
  {
    title: "Hades II",
    keywords: ["hades", "supergiant", "melinoe", "zagreus", "greek", "roguelike"],
    overview: "Battle beyond the Underworld using dark sorcery to take down the Titan of Time in this spellbinding action-roguelike.",
    release_date: "2024-05-06",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "Nintendo Switch"],
    site_detail_url: "https://www.giantbomb.com/hades-ii/3030-87989/"
  },
  {
    title: "The Last of Us Part I",
    keywords: ["last of us", "tlou", "joel", "ellie", "zombie", "clicker", "naughty dog"],
    overview: "In a devastated civilization, where infected and hardened survivors run rampant, Joel, a weary protagonist, is hired to smuggle 14-year-old Ellie.",
    release_date: "2022-09-02",
    platforms: ["PC", "PlayStation 5"],
    site_detail_url: "https://www.giantbomb.com/the-last-of-us-part-i/3030-86361/"
  },
  {
    title: "God of War Ragnarok",
    keywords: ["god of war", "gow", "kratos", "atreus", "thor", "odin", "norse"],
    overview: "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle.",
    release_date: "2022-11-09",
    platforms: ["PC", "PlayStation 5", "PlayStation 4"],
    site_detail_url: "https://www.giantbomb.com/god-of-war-ragnarok/3030-80252/"
  },
  {
    title: "Baldur's Gate 3",
    keywords: ["baldur", "gate", "bg3", "larian", "dnd", "dungeons", "dragons"],
    overview: "Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, sacrifice, and ultimate power.",
    release_date: "2023-08-03",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X", "macOS"],
    site_detail_url: "https://www.giantbomb.com/baldurs-gate-iii/3030-73711/"
  },
  {
    title: "Valorant",
    keywords: ["valorant", "riot", "fps", "agents", "shooter", "tactical"],
    overview: "A character-based 5v5 tactical shooter from Riot Games featuring precise gunplay combined with unique agent abilities.",
    release_date: "2020-06-02",
    platforms: ["PC", "PlayStation 5", "Xbox Series S/X"],
    site_detail_url: "https://www.giantbomb.com/valorant/3030-75117/"
  },
  {
    title: "Counter-Strike 2",
    keywords: ["cs2", "counter strike", "valve", "tactical shooter", "dust2", "cases"],
    overview: "The next era of Counter-Strike. A major leap forward technically, built on the Source 2 engine, introducing responsive volumetric smoke.",
    release_date: "2023-09-27",
    platforms: ["PC", "Linux"],
    site_detail_url: "https://www.giantbomb.com/counter-strike-2/3030-88849/"
  },
  {
    title: "Super Mario Bros. Wonder",
    keywords: ["mario", "wonder", "peach", "luigi", "bowser", "nintendo"],
    overview: "Classic side-scrolling Mario gameplay is turned on its head with the addition of Wonder Flowers, which trigger game-changing effects.",
    release_date: "2023-10-20",
    platforms: ["Nintendo Switch"],
    site_detail_url: "https://www.giantbomb.com/super-mario-bros-wonder/3030-89475/"
  },
  {
    title: "Spiderman 2",
    keywords: ["spiderman", "peter parker", "miles morales", "venom", "insomniac"],
    overview: "Swing, jump, and utilize the new Web Wings to travel across Marvel's New York, switching between Peter Parker and Miles Morales.",
    release_date: "2023-10-20",
    platforms: ["PlayStation 5"],
    site_detail_url: "https://www.giantbomb.com/marvels-spider-man-2/3030-83815/"
  }
];

const OFFLINE_ANIME = [
  {
    title: "Demon Slayer: Kimetsu no Yaiba",
    keywords: ["demon slayer", "kimetsu no yaiba", "tanjiro", "nezuko", "ufotable", "muzun"],
    overview: "Tanjiro Kamado becomes a demon slayer after his family is slaughtered and his younger sister Nezuko is turned into a demon.",
    release_date: "2019",
    type: "TV",
    episodes: 26,
    score: 8.5
  },
  {
    title: "Attack on Titan",
    keywords: ["attack on titan", "shingeki no kyojin", "eren", "mikasa", "levi", "wall", "colossus"],
    overview: "After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant Titans.",
    release_date: "2013",
    type: "TV",
    episodes: 25,
    score: 8.8
  },
  {
    title: "Solo Leveling",
    keywords: ["solo leveling", "sung jin-woo", "hunter", "level", "shadow", "monarch"],
    overview: "In a world where hunters must battle monsters to survive, the weakest hunter Jin-woo Sung obtains a mysterious system upgrade option.",
    release_date: "2024",
    type: "TV",
    episodes: 12,
    score: 8.3
  },
  {
    title: "One Piece",
    keywords: ["one piece", "luffy", "zoro", "nami", "straw hat", "pirate", "gear 5"],
    overview: "Gold Roger, the King of the Pirates, claimed to have left behind his ultimate treasure. Monkey D. Luffy sets out to find it.",
    release_date: "1999",
    type: "TV",
    episodes: 1100,
    score: 8.7
  },
  {
    title: "Naruto Shippuden",
    keywords: ["naruto", "shippuden", "sasuke", "sakura", "kakashi", "itachi", "akatsuki"],
    overview: "Naruto Uzumaki returns to the Leaf Village after years of training to face dangerous challenges and save his friend Sasuke.",
    release_date: "2007",
    type: "TV",
    episodes: 500,
    score: 8.25
  },
  {
    title: "Death Note",
    keywords: ["death note", "light yagami", "l", "ryuk", "kira", "apple", "shinigami"],
    overview: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world using a notebook of death.",
    release_date: "2006",
    type: "TV",
    episodes: 37,
    score: 8.6
  },
  {
    title: "My Hero Academia",
    keywords: ["my hero academia", "boku no hero", "deku", "izuku", "bakugo", "all might", "quirk"],
    overview: "In a world where most people possess superpowers known as Quirks, Izuku Midoriya fights to become the ultimate hero.",
    release_date: "2016",
    type: "TV",
    episodes: 13,
    score: 7.9
  },
  {
    title: "Jujutsu Kaisen",
    keywords: ["jujutsu kaisen", "jjk", "gojo", "itadori", "sukuna", "megumi", "cursed"],
    overview: "A boy swallows a cursed finger to save his classmates, becoming the vessel of Sukuna, the legendary King of Curses.",
    release_date: "2020",
    type: "TV",
    episodes: 24,
    score: 8.6
  },
  {
    title: "Bleach: Thousand-Year Blood War",
    keywords: ["bleach", "tybw", "ichigo", "rukia", "yhwach", "shinigami", "soul society"],
    overview: "The Quincy resurgence threatens the Soul Society. Proxy Soul Reaper Ichigo Kurosaki enters the fray with upgraded powers.",
    release_date: "2022",
    type: "TV",
    episodes: 13,
    score: 8.9
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    keywords: ["fma", "brotherhood", "elric", "alphonse", "alchemist", "philosopher"],
    overview: "Two brothers search for the Philosopher's Stone to restore their bodies after a failed attempt at human transmutation.",
    release_date: "2009",
    type: "TV",
    episodes: 64,
    score: 9.1
  },
  {
    title: "Chainsaw Man",
    keywords: ["chainsaw man", "denji", "makima", "power", "aki", "pochita", "devil"],
    overview: "Denji, a destitute young man, makes a contract with the chainsaw devil Pochita, reviving as the terrifying Chainsaw Man.",
    release_date: "2022",
    type: "TV",
    episodes: 12,
    score: 8.5
  },
  {
    title: "Frieren: Beyond Journey's End",
    keywords: ["frieren", "beyond journey", "fern", "stark", "himmel", "elf"],
    overview: "Elf mage Frieren embarks on a nostalgic journey to retrace her fallen hero companions' footsteps and understand humans better.",
    release_date: "2023",
    type: "TV",
    episodes: 28,
    score: 9.35
  }
];

const OFFLINE_SOFTWARE = [
  {
    title: "Windows 11",
    keywords: ["windows", "win11", "os", "microsoft", "operating system"],
    overview: "Windows 11 provides a calm and creative space where you can pursue your passions through a fresh experience.",
    release_date: "2021",
    icon_domain: "microsoft.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Windows_logo_-_2021.svg"
  },
  {
    title: "Ubuntu Linux",
    keywords: ["ubuntu", "linux", "os", "operating system"],
    overview: "The modern, open source operating system on Linux for the enterprise server, desktop, cloud, and IoT.",
    release_date: "2004",
    icon_domain: "ubuntu.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo-ubuntu_cof-orange-hex.svg"
  },
  {
    title: "Android OS",
    keywords: ["android", "apk", "os", "google", "mobile operating system"],
    overview: "Android is the world's most popular mobile operating system, powering billions of devices.",
    release_date: "2008",
    icon_domain: "android.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Android_robot.svg"
  },
  {
    title: "Kali Linux",
    keywords: ["kali", "linux", "os", "penetration testing", "security"],
    overview: "Kali Linux is an advanced penetration testing Linux distribution used for ethical hacking and network security assessments.",
    release_date: "2013",
    icon_domain: "kali.org",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Kali_Linux_logo.svg"
  },
  {
    title: "Adobe Premiere Pro",
    keywords: ["adobe", "premiere", "pro", "video", "editing", "cc"],
    overview: "Industry-leading video editing software for film, TV, and the web. Creative tools, integration with other Adobe apps and services.",
    release_date: "2003",
    icon_domain: "adobe.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg"
  },
  {
    title: "Adobe Photoshop",
    keywords: ["adobe", "photoshop", "ps", "photo", "editing", "image"],
    overview: "The world's best imaging and graphic design software is at the core of almost every creative project, from photo editing to digital painting.",
    release_date: "1990",
    icon_domain: "adobe.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg"
  },
  {
    title: "Adobe Lightroom",
    keywords: ["adobe", "lightroom", "lr", "photo", "editing", "image"],
    overview: "Cloud-based photo service that gives you everything you need to create, edit, organize, store, and share your photos.",
    release_date: "2007",
    icon_domain: "adobe.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg"
  },
  {
    title: "Microsoft Office",
    keywords: ["microsoft", "office", "word", "excel", "powerpoint", "365"],
    overview: "A family of client software, server software, and services developed by Microsoft, including word processing, spreadsheets, and presentations.",
    release_date: "1990",
    icon_domain: "microsoft.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg"
  },
  {
    title: "Figma",
    keywords: ["figma", "design", "ui", "ux", "prototype", "vector"],
    overview: "A collaborative web application for interface design, with additional offline features enabled by desktop applications.",
    release_date: "2016",
    icon_domain: "figma.com",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg"
  },
  {
    title: "Internet Download Manager",
    keywords: ["idm", "internet", "download", "manager", "fast", "speed"],
    overview: "A tool to increase download speeds by up to 5 times, resume and schedule downloads with comprehensive error recovery.",
    release_date: "2001",
    icon_domain: "internetdownloadmanager.com",
    image_url: "https://upload.wikimedia.org/wikipedia/en/9/92/Internet_Download_Manager_logo.png"
  },
  {
    title: "WinRAR",
    keywords: ["winrar", "rar", "zip", "extract", "compress", "archive"],
    overview: "A powerful archive manager that can backup your data and reduce the size of email attachments, decompresses RAR, ZIP and other files.",
    release_date: "1995",
    icon_domain: "rarlab.com"
  },
  {
    title: "OBS Studio",
    keywords: ["obs", "studio", "stream", "record", "broadcast", "video"],
    overview: "Free and open source software for video recording and live streaming. Download and start streaming quickly and easily on Windows, Mac or Linux.",
    release_date: "2012",
    icon_domain: "obsproject.com"
  },
  {
    title: "FL Studio",
    keywords: ["fl", "studio", "fruity", "loops", "music", "daw", "audio"],
    overview: "A complete software music production environment or Digital Audio Workstation (DAW) for composing, arranging, recording, editing, mixing.",
    release_date: "1997",
    icon_domain: "image-line.com"
  },
  {
    title: "Ableton Live",
    keywords: ["ableton", "live", "music", "daw", "audio", "production"],
    overview: "Fast, fluid and flexible software for music creation and performance. It comes with effects, instruments, sounds and all kinds of creative features.",
    release_date: "2001",
    icon_domain: "ableton.com"
  },
  {
    title: "Visual Studio Code",
    keywords: ["vscode", "visual", "studio", "code", "editor", "programming", "ide"],
    overview: "Code editor redefined and optimized for building and debugging modern web and cloud applications. Free and available on your favorite platform.",
    release_date: "2015",
    icon_domain: "visualstudio.com"
  }
];

function generateOfflineFallback(query: string, category: "game" | "anime" | "software"): any[] {
  const norm = query.toLowerCase().trim();
  const results: any[] = [];
  
  if (category === "game") {
    for (const game of OFFLINE_GAMES) {
      if (game.keywords.some(kw => norm.includes(kw)) || game.title.toLowerCase().includes(norm)) {
        results.push({
          id: `offline-game-${game.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          title: game.title,
          overview: game.overview,
          release_date: game.release_date,
          platforms: game.platforms,
          site_detail_url: game.site_detail_url,
          poster_path: null
        });
      }
    }
    // Removed synth-game hallucination
  } else if (category === "anime") {
    for (const anime of OFFLINE_ANIME) {
      if (anime.keywords.some(kw => norm.includes(kw)) || anime.title.toLowerCase().includes(norm)) {
        results.push({
          id: `offline-anime-${anime.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          title: anime.title,
          overview: anime.overview,
          release_date: anime.release_date,
          type: "TV",
          episodes: anime.episodes,
          score: anime.score,
          poster_path: null
        });
      }
    }
    // Removed synth-anime hallucination
  } else if (category === "software") {
    for (const hw of OFFLINE_SOFTWARE) {
      if (hw.keywords.some(kw => norm.includes(kw)) || hw.title.toLowerCase().includes(norm)) {
        results.push({
          id: `offline-software-${hw.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          title: hw.title,
          overview: hw.overview,
          release_date: hw.release_date,
          icon_domain: hw.icon_domain,
          type: "software",
          poster_path: (hw as any).image_url || (hw.icon_domain ? `https://logo.clearbit.com/${hw.icon_domain}?size=500` : null) || (hw.icon_domain ? `https://www.google.com/s2/favicons?domain=${hw.icon_domain}&sz=512` : null),
          backdrop_path: (hw as any).image_url || (hw.icon_domain ? `https://logo.clearbit.com/${hw.icon_domain}?size=500` : null) || (hw.icon_domain ? `https://www.google.com/s2/favicons?domain=${hw.icon_domain}&sz=512` : null)
        });
      }
    }
  }

  if (results.length === 0) {
    // If we're fallbacking, assume the query is the best guess for the company
    const inferredDomain = norm.replace(/[^a-z0-9]/g, "") + ".com";
    results.push({
      id: `offline-${category}-${norm.replace(/[^a-z0-9]+/g, "-")}`,
      title: query.trim() || 'Software Suite',
      overview: `Premium ${category} title.`,
      release_date: "Unknown",
      icon_domain: category === 'software' ? inferredDomain : undefined,
      type: category === 'anime' ? 'TV' : category,
      poster_path: null
    });
  }
  
  return results;
}

async function generateFallbacksWithGemini(query: string, category: "game" | "anime" | "software"): Promise<any[]> {
  const prompt = category === "game" 
    ? `You are a video game encyclopedia database. The user searched for: "${query}". 
       Provide up to 5 accurate video games matching this search query, ordered by popularity/relevance.
       Include cohesive description of the game, its release date, and listing popular platforms.
       If no real games match this query, return an empty array []. Do not invent games.`
    : category === "anime"
    ? `You are an anime library encyclopedia database. The user searched for: "${query}". 
       Provide up to 5 accurate anime titles matching this search query, ordered by popularity/relevance.
       Include cohesive synopsis, debut year, total episodes, and typical MAL rating score.
       If no real anime match this query, return an empty array []. Do not invent anime.`
    : `You are a premium software tools app index. The user searched for: "${query}".
       Provide up to 5 accurate PC software, Android APKs, Windows/Linux Operating Systems, or utilities matching this query, ordered by relevance.
       Include a professional description and launch year.
       CRITICAL: You MUST provide an accurate direct image URL for the exact software logo in 'image_url'. Prioritize high-quality Wikimedia Commons transparent PNG/SVG URLs (e.g., "https://upload.wikimedia.org/wikipedia/commons/..."). Ensure it is the exact software's logo (not just the developer company).
       If no real software packages match this query, return an empty array []. Do not invent software.`;

  const config = category === "game" || category === "software"
    ? {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: `unique string starting with 'fallback-${category}-' followed by standard name slug` },
              title: { type: Type.STRING },
              overview: { type: Type.STRING },
              release_date: { type: Type.STRING },
              icon_domain: { type: Type.STRING, description: "The primary official website domain for this software/game (e.g., adobe.com, microsoft.com). Do not include https/www. We will use this to fetch their logo." },
              image_url: { type: Type.STRING, description: "Direct high-quality transparent PNG/SVG logo URL, preferably from Wikimedia Commons." },
              platforms: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              site_detail_url: { type: Type.STRING }
            },
            required: ["id", "title", "overview", "release_date", "icon_domain"]
          }
        }
      }
    : {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "unique string starting with 'fallback-anime-' followed by standard name slug" },
              title: { type: Type.STRING },
              overview: { type: Type.STRING },
              release_date: { type: Type.STRING },
              type: { type: Type.STRING },
              episodes: { type: Type.INTEGER },
              score: { type: Type.NUMBER }
            },
            required: ["id", "title", "overview", "release_date", "type", "episodes", "score"]
          }
        }
      };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: config
    });

    const text = response.text?.trim() || "[]";
    const parsed = cleanAndParseJSON(text);
    
    if (Array.isArray(parsed)) {
      // Ensure expected standard structures are met
      return parsed.map((item: any) => ({
        ...item,
        site_detail_url: item.site_detail_url || "#",
        poster_path: null
      }));
    }
    return generateOfflineFallback(query, category);
  } catch (error: any) {
    if (error?.status !== 429 && !error?.message?.includes('429')) {
      console.log("[Gemini API] Fallback triggered due to API issue");
    }
    // Suppress warning on quota/parsing failure and serve offline database smoothly
    return generateOfflineFallback(query, category);
  }
}

const brandfetchCache = new Map<string, string | null>();

async function fetchBrandfetchLogo(query: string, domainHint?: string): Promise<string | null> {
  const apiKey = process.env.BRANDFETCH_API_KEY;
  if (!apiKey) return null;

  const cacheKey = `${query.toLowerCase()}-${domainHint || ''}`;
  if (brandfetchCache.has(cacheKey)) {
    console.log(`[Brandfetch Cache Hit] ${cacheKey}`);
    return brandfetchCache.get(cacheKey) || null;
  }

  const retries = 3;
  const baseDelay = 1000;

  try {
    let domain = domainHint;
    if (!domain) {
      // Bypass slow Gemini lookup and immediately fallback to Google Custom Search 
      brandfetchCache.set(cacheKey, null);
      return null;
    }

    const url = `https://api.brandfetch.io/v2/brands/${domain}`;
    
    let bfRes;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        bfRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });
        if (bfRes.ok || bfRes.status === 404) break; // Don't retry 404
      } catch (e) {
        if (attempt === retries - 1) throw e;
      }
      
      if (attempt < retries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(res => setTimeout(res, delay));
      }
    }

    if (!bfRes || !bfRes.ok) {
       brandfetchCache.set(cacheKey, null);
       return null;
    }
    const bbdata = await bfRes.json();
    
    // Extract best logo (transparent PNG/SVG ideally)
    const logos = bbdata.logos || [];
    if (logos.length > 0) {
      // Prioritize full logo over icon if available to avoid small icons when full logos exist
      let targetLogoInfo = logos.find((l: any) => l.type === "logo");
      if (!targetLogoInfo) {
        targetLogoInfo = logos[0]; // fallback to whatever is first (could be icon/symbol)
      }
      
      if (targetLogoInfo && targetLogoInfo.formats && targetLogoInfo.formats.length > 0) {
         // 1. Search for and extract SVG
         const svg = targetLogoInfo.formats.find((f: any) => f.format === 'svg');
         if (svg) {
            brandfetchCache.set(cacheKey, svg.src);
            return svg.src;
         }

         // 2. If SVG not available, fallback to PNG format but filter for the highest resolution
         const pngs = targetLogoInfo.formats.filter((f: any) => f.format === 'png');
         if (pngs.length > 0) {
           pngs.sort((a: any, b: any) => {
             const sizeA = (a.width || 0) * (a.height || 0);
             const sizeB = (b.width || 0) * (b.height || 0);
             return sizeB - sizeA;
           });
           brandfetchCache.set(cacheKey, pngs[0].src);
           return pngs[0].src;
         }

         const fallbackSrc = targetLogoInfo.formats[0].src;
         brandfetchCache.set(cacheKey, fallbackSrc);
         return fallbackSrc;
      }
    }
    brandfetchCache.set(cacheKey, null);
    return null;
  } catch (err) {
    console.error("Brandfetch error:", err);
    brandfetchCache.set(cacheKey, null);
    return null;
  }
}

async function enhancePostersWithGoogle(results: any[], category: string): Promise<any[]> {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;
  if (!apiKey || !cx) return results;

  // Fast-path: Only enhance the top 4 results to ensure blazing fast response times.
  // Lower results will use their existing AI or icon fallback strategies.
  const priorityResults = results.slice(0, 4);
  const remainingResults = results.slice(4);

  const enhancedPriority = await Promise.all(priorityResults.map(async (item) => {
    // Check if poster is missing or is using a weak fallback (clearbit, favicon, null)
    // For software and anime, Gemini hallucinates URLs often, so if category is software, we always want verified images.
    const isHallucinatedWikimedia = item.poster_path && item.poster_path.includes("wikimedia.org");
    const needsBetterPoster = !item.poster_path || 
                              item.poster_path.includes("logo.clearbit.com") || 
                              item.poster_path.includes("s2/favicons") ||
                              isHallucinatedWikimedia ||
                              category === "software" || category === "system" || category === "tool";
                              
    if (needsBetterPoster) {
      const queryStr = item.original_title || item.title || item.name || "";
      if (queryStr) {
        // Fallback to Google Custom Search directly for maximum speed and accuracy
        const link = await GoogleCustomSearchService.fetchHighQualityImage(queryStr, category);
        if (link) {
           return { ...item, poster_path: link, backdrop_path: link };
        }
      }
    }
    return item;
  }));

  return [...enhancedPriority, ...remainingResults];
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API Routes
  app.get("/api/proxy-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("Missing url parameter");
    }

    try {
      const parsedUrl = new URL(imageUrl);
      const targetOrigin = parsedUrl.origin;
      
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
          "Referer": targetOrigin,
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
        }
      });

      if (!response.ok) {
        throw new Error(`Proxy fetch fell back with status ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400"); // Cache for 24 hours
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.send(buffer);
    } catch (err: any) {
      // Return placeholders or error status gracefully
      res.status(404).send("Failed to proxy requested media");
    }
  });

  app.post("/api/search/enhance", async (req, res) => {
    const { query } = req.body;
    if (!query || query.length < 2) {
      return res.json({ enhancedQuery: query });
    }

    try {
      const prompt = `You are a search assistant for a web resource directory called "Web Universe". 
      The user typed: "${query}". 
      Your task is to rephrase or expand this query with 2-3 highly relevant keywords or synonyms that would help find relevant websites like streaming, games, software, torrents, anime, tech, etc.
      
      Response format: strictly return only the expanded query as a single string. 
      Example: 
      Input: "film" 
      Output: "film movie streaming cinema"
      
      Input: "game"
      Output: "game play playstation xbox"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          temperature: 0.1,
          maxOutputTokens: 20,
        }
      });

      const enhancedQuery = response.text?.trim() || query;
      res.json({ enhancedQuery });
    } catch (error: any) {
      if (error?.status !== 429 && !error?.message?.includes('429')) {
        console.error("Gemini Error in search enhance:", error);
      }
      res.json({ enhancedQuery: query }); // Fallback to original query
    }
  });

  // TMDB Movie/Series Search Proxy
const applyStrictMatchAndRank = (results: any[], query: string) => {
  const qStr = query.toLowerCase().trim();
  if (!qStr) return results;

  let filtered = results;
  
  filtered.sort((a, b) => {
      const aT = (a.title || a.name || "").toLowerCase();
      const bT = (b.title || b.name || "").toLowerCase();
      
      const aExact = aT === qStr;
      const bExact = bT === qStr;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      const aHasImg = !!(a.poster_path || a.backdrop_path || a.icon_domain || a.image || a.image_url);
      const bHasImg = !!(b.poster_path || b.backdrop_path || b.icon_domain || b.image || b.image_url);
      
      if (aHasImg && !bHasImg) return -1;
      if (!aHasImg && bHasImg) return 1;

      const aStarts = aT.startsWith(qStr);
      const bStarts = bT.startsWith(qStr);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      const aIncludes = aT.includes(qStr);
      const bIncludes = bT.includes(qStr);
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      
      if (aIncludes && bIncludes) {
         return aT.length - bT.length;
      }

      return 0;
  });

  return filtered;
};

  app.get("/api/search/movie", async (req, res) => {
    const query = req.query.query as string;
    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }

    const cacheKey = `movie_${query.trim().toLowerCase()}`;
    const cached = getSearchCache(cacheKey);
    if (cached) {
      return res.json({ results: cached });
    }

    const tmbdKey = process.env.TMDB_API_KEY || "be24695fd53ff3cf93d062aca100e5fc";
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${tmbdKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;

    try {
      const response = await fetchWithRetry(url, {}, 1, 200);
      if (!response.ok) {
        throw new Error(`TMDB responded with status ${response.status}`);
      }
      const data = await response.json();
      
      // Filter out non-movie/non-tv items (e.g. people)
      const filtered = (data.results || [])
        .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 40)
        .map((item: any) => ({
          id: item.id,
          title: item.title || item.name || "Untitled",
          original_title: item.original_title || item.original_name,
          media_type: item.media_type,
          overview: item.overview || "No description available.",
          poster_path: item.poster_path ? `https://image.tmdb.org/t/p/w342${item.poster_path}` : null,
          backdrop_path: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
          release_date: item.release_date || item.first_air_date || "Unknown",
          vote_average: item.vote_average || 0,
          genre_ids: item.genre_ids || []
        }));

      const enhancedFiltered = await enhancePostersWithGoogle(filtered, "movie");
      setSearchCache(cacheKey, enhancedFiltered);
      res.json({ results: enhancedFiltered });
    } catch (error: any) {
      console.error("TMDB Proxy Error:", error.message);
      res.status(500).json({ error: "Failed to fetch from TMDB", details: error.message });
    }
  });

  // Steam API Game Proxy (Blazing Fast)
  app.get("/api/search/game", async (req, res) => {
    const query = req.query.query as string;
    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }

    const cacheKey = `game_${query.trim().toLowerCase()}`;
    const cached = getSearchCache(cacheKey);
    if (cached) {
      return res.json({ results: cached });
    }

    const giantBombKey = process.env.GIANTBOMB_API_KEY || "f4f811641d249eb5b5ae8992ee3048f2771c4057";
    const giantBombUrl = `https://www.giantbomb.com/api/search/?api_key=${giantBombKey}&format=json&query=${encodeURIComponent(query)}&resources=game&limit=10`;
    const steamUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;

    try {
      const fetchPromises = [
        fetchWithRetry(giantBombUrl, { "User-Agent": "SmartIndexApp/1.0" }, 1, 300).then(async res => {
          if (!res.ok) throw new Error("GiantBomb failed");
          const data = await res.json();
          return (data.results || []).slice(0, 40).map((item: any) => ({
            id: `game-${item.id}`,
            title: item.name || item.aliases?.split('\n')[0] || "Untitled Game",
            overview: item.deck || item.description?.replace(/<[^>]+>/g, '').substring(0, 200) + "..." || "No summary available.",
            poster_path: item.image ? (item.image.medium_url || item.image.screen_url || item.image.small_url) : null,
            release_date: item.original_release_date ? item.original_release_date.split("-")[0] : "Game",
            site_detail_url: item.site_detail_url,
            type: "game"
          }));
        }),
        fetch(steamUrl).then(async res => {
          if (!res.ok) throw new Error("Steam failed");
          const data = await res.json();
          return (data.items || []).slice(0, 40).map((i: any) => ({
            id: i.id,
            title: i.name,
            overview: "Available on Steam.",
            poster_path: `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${i.id}/library_600x900_2x.jpg`,
            release_date: "Game",
            type: "game"
          }));
        }),
        generateFallbacksWithGemini(query, "game").then(res => {
          return applyStrictMatchAndRank(res.map((item: any) => ({
            ...item,
            poster_path: item.image_url || (item.icon_domain ? `https://www.google.com/s2/favicons?domain=${item.icon_domain}&sz=512` : null),
            backdrop_path: item.image_url || null,
            type: "game"
          })), query);
        })
      ];

      const results = await Promise.allSettled(fetchPromises);
      
      let merged: any[] = [];
      const addToMerged = (arr: any[]) => {
        arr.forEach(item => {
          if (!merged.find(m => m.title.toLowerCase() === item.title.toLowerCase())) {
            merged.push(item);
          }
        });
      };

      if (results[0].status === "fulfilled" && results[0].value.length > 0) addToMerged(results[0].value);
      if (results[1].status === "fulfilled" && results[1].value.length > 0) addToMerged(results[1].value);
      if (results[2].status === "fulfilled" && results[2].value.length > 0) addToMerged(results[2].value);

      const enhancedMapped = await enhancePostersWithGoogle(merged, "game");
      setSearchCache(cacheKey, enhancedMapped);
      return res.json({ results: enhancedMapped });
    } catch (error: any) {
      return res.json({ results: [] });
    }
  });

  app.get("/api/search/software", async (req, res) => {
    const query = req.query.query as string;
    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }

    const cacheKey = `software_${query.trim().toLowerCase()}`;
    const cached = getSearchCache(cacheKey);
    if (cached) {
      return res.json({ results: cached });
    }

    try {
      // 1. Try blazing fast iTunes Software API first
      console.log(`[API] Fetching software via iTunes API for query: ${query}`);
      const itunesRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=software,macSoftware,ipadSoftware&limit=10`);
      if (itunesRes.ok) {
        const data = await itunesRes.json();
        if (data.results && data.results.length > 0) {
           const mapped = data.results.map((item: any) => ({
              id: item.trackId,
              title: item.trackName,
              overview: item.description || "",
              release_date: item.releaseDate ? item.releaseDate.substring(0,4) : "Unknown",
              poster_path: item.artworkUrl512 || item.artworkUrl100,
              backdrop_path: item.artworkUrl512 || item.artworkUrl100,
              type: "software",
              icon_domain: item.sellerUrl ? new URL(item.sellerUrl).hostname : null
           }));
           const strictMapped = applyStrictMatchAndRank(mapped, query);
           if (strictMapped.length > 0) {
              setSearchCache(cacheKey, strictMapped);
              return res.json({ results: strictMapped });
           }
        }
      }

      // 2. Fallback to Gemini if nothing found
      console.log(`[API] Fetching software fallback for query: ${query}`);
      const fallbackResults = await generateFallbacksWithGemini(query, "software");
      const enhancedResults = fallbackResults.map((item: any) => ({
        ...item,
        poster_path: (item.icon_domain ? `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${item.icon_domain}&size=256` : null) || item.image_url,
        backdrop_path: (item.icon_domain ? `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${item.icon_domain}&size=256` : null) || item.image_url,
        type: "software",
        icon_domain: item.icon_domain
      }));
      const strictMappedGemini = applyStrictMatchAndRank(enhancedResults, query);
      const googleEnhanced = await enhancePostersWithGoogle(strictMappedGemini, "software");
      setSearchCache(cacheKey, googleEnhanced);
      return res.json({ results: googleEnhanced });
    } catch (e: any) {
      if (e?.status !== 429 && !e?.message?.includes('429')) {
        console.error("[API] Software API request failed:", e?.message || e);
      }
      return res.json({ results: [] });
    }
  });

  // AniList Anime Search Proxy (More reliable than Jikan)
  app.get("/api/search/anime", async (req, res) => {
    const query = req.query.query as string;
    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }

    const cacheKey = `anime_${query.trim().toLowerCase()}`;
    const cached = getSearchCache(cacheKey);
    if (cached) {
      return res.json({ results: cached });
    }

    const anilistQuery = `
      query ($search: String) {
        Page(page: 1, perPage: 12) {
          media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
            id
            title {
              english
              romaji
            }
            description
            coverImage {
              large
              extraLarge
            }
            startDate {
              year
              month
              day
            }
            episodes
            averageScore
          }
        }
      }
    `;

    try {
      const response = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          query: anilistQuery,
          variables: { search: query }
        })
      });

      if (!response.ok) {
        throw new Error(`AniList responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      const mapped = (data?.data?.Page?.media || []).map((item: any) => {
        const title = item.title?.english || item.title?.romaji || "Untitled Anime";
        let date = "Unknown";
        if (item.startDate?.year) {
           date = `${item.startDate.year}-${item.startDate.month ? String(item.startDate.month).padStart(2, '0') : '01'}-${item.startDate.day ? String(item.startDate.day).padStart(2, '0') : '01'}`;
        }
        
        const desc = item.description ? item.description.replace(/<[^>]*>?/gm, '') : "No description available.";

        return {
          id: `anime-${item.id}`,
          title: title,
          overview: desc,
          poster_path: item.coverImage?.extraLarge || item.coverImage?.large || null,
          release_date: date,
          type: "anime",
          episodes: item.episodes || 0,
          score: item.averageScore || 0
        };
      });

      const enhancedMapped = await enhancePostersWithGoogle(mapped, "anime");
      setSearchCache(cacheKey, enhancedMapped);
      return res.json({ results: enhancedMapped });
    } catch (error: any) {
      console.warn(`AniList error (${error.message}). Invoking Gemini Anime fallback...`);
      // Try to construct high-fidelity response using AI model
      const fallbackResults = await generateFallbacksWithGemini(query, "anime");
      if (fallbackResults && fallbackResults.length > 0) {
        const googleEnhanced = await enhancePostersWithGoogle(fallbackResults, "anime");
        setSearchCache(cacheKey, googleEnhanced);
        return res.json({ results: googleEnhanced });
      }
      return res.json({ results: [] });
    }
  });

  // Screenshot Upload and Identification (multimodal vision)

  app.post("/api/search/screenshot", async (req, res) => {
    const { base64Image, isAnime, mimeType } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: "Missing required screenshot base64 image data." });
    }

    try {
      // Clean up base64 prefix if present
      const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

      // Send to Gemini Multimodal 3.5-flash
      const imagePart = {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: cleanBase64,
        },
      };

      const prompt = `Extract the main text (title, subject, or heading) from this image exactly as it appears. If there is no clear text, identify the main subject of the image. Return ONLY the plain text. Do NOT include any other words, markdown, quotes, or explanation. If the image contains a full title like 'Avengers Secret Wars', return exactly 'Avengers Secret Wars'.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            text: prompt
          },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || "image/jpeg"
            }
          }
        ],
        config: {
          temperature: 0.1,
          maxOutputTokens: 30,
        }
      });

      const detectedTitle = response.text?.trim() || "Unknown";
      res.json({ title: detectedTitle, source: "Gemini AI" });
    } catch (error: any) {
      if (error?.status === 429 || error?.message?.includes('429')) {
        console.error("Screenshot Analysis 429 Error:", error?.message);
        return res.status(429).json({ error: "AI search quota exceeded. Please wait a moment and try again." });
      }
      console.error("Screenshot Analysis Error:", error);
      res.status(500).json({ error: "Failed to perform AI screenshot identification", details: error.message });
    }
  });

  // Live website scraping status checkups
  app.get("/api/search/live-scrapers", async (req, res) => {
    const query = req.query.query as string;
    const category = req.query.category as string;
    const domainsStr = req.query.domains as string;

    if (!query || query.trim().length === 0) {
      return res.json({ results: [] });
    }

    let domains: string[] | undefined = undefined;
    if (domainsStr) {
      domains = domainsStr.split(",").map(d => d.trim()).filter(Boolean);
    }

    try {
      const results = await scrapeQuery(query, { domains, category });
      res.json({ results });
    } catch (error: any) {
      console.error("Scraper Endpoint Error:", error.message);
      res.status(500).json({ error: "Failed to perform live scraping checkup", details: error.message });
    }
  });

  // Real-time server-sent events (SSE) streaming for incremental instant results
  app.get("/api/search/live-scrapers-stream", async (req, res) => {
    const query = req.query.query as string;
    const category = req.query.category as string;
    const domainsStr = req.query.domains as string;

    if (!query || query.trim().length === 0) {
      res.writeHead(200, { "Content-Type": "text/event-stream" });
      res.write("event: end\ndata: {}\n\n");
      return res.end();
    }

    let domains: string[] | undefined = undefined;
    if (domainsStr) {
      domains = domainsStr.split(",").map(d => d.trim()).filter(Boolean);
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    const heartbeat = setInterval(() => {
      res.write(":\n\n");
    }, 7000);

    let isClosed = false;
    req.on("close", () => {
      isClosed = true;
      clearInterval(heartbeat);
    });

    try {
      await scrapeQuery(query, { domains, category }, (result) => {
        if (!isClosed) {
          res.write(`data: ${JSON.stringify(result)}\n\n`);
        }
      });
    } catch (err: any) {
      console.error("[SSE Stream Error]:", err.message);
    } finally {
      clearInterval(heartbeat);
      if (!isClosed) {
        res.write("event: end\ndata: {}\n\n");
        res.end();
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
