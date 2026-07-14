import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  Suspense } from "react";
import toast from "react-hot-toast";

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
import { TiltCardWrapper } from "../components/TiltCardWrapper";
import { analyzeSearchQuery } from "../utils/ResultProcessor";
// Removed duplicate imports
import { ImageWithSkeleton } from "../components/ImageWithSkeleton";
import { motion, AnimatePresence } from "motion/react";
import Fuse from "fuse.js";
import {
  Search,
  Sparkles,
  MonitorPlay,
  Clapperboard,
  Gamepad2,
  Package,
  Magnet,
  Star,
  ExternalLink,
  Copy,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Activity,
  ShieldCheck,
  Flame,
  Layers,
  AlertCircle,
  Bot,
  Zap,
  ArrowUpRight,
  Image as ImageIcon,
  Loader2,
  Tv,
  CheckCircle,
  AlertTriangle,
  List,
  LayoutGrid,
  Smartphone,
  Cpu,
  CircleDot,
  Monitor,
  Settings,
  Dices,
  Keyboard,
  HardDrive,
  Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { getSmartFitStyles } from "../components/DirectoryLayout";
import Navbar from "@/src/components/Navbar";
import { SEARCH_PROVIDERS, SearchProvider } from "../data/searchResources";
import { getAllResources, PortalItem } from "../data/allData";
import {
  GlassySkeletonLoader,
  PortalLogo,
  PortalCard,
  VirtualGridItem } from "@/src/components/DirectoryLayout";
import { useImagePreloader } from "@/src/hooks/useImagePreloader";
import { getLogoForPortal } from "@/src/utils/logoMapper";
import {
  getCachedImage,
  saveImageToCache,
  inlineMemoryCache,
  getMappedIconUrl,
  saveMappedIconUrl,
  getCachedSearchResults,
  saveCachedSearchResults } from "@/src/lib/indexedDbCache";

// Lazy Loaded Heavy Components
const Dashboard = React.lazy(() => import("./Dashboard"));
const Developer = React.lazy(() => import("@/src/components/Developer"));
const Footer = React.lazy(() => import("@/src/components/Footer"));

// Curated offline software and OS matches to deliver ultra-fast results instantly
const OFFLINE_SOFTWARE_SUGGESTIONS = [
  {
    title: "Windows 11 Professional (OS)",
    type: "software",
    release_date: "2021",
    overview:
      "The latest high-performance desktop operating system from Microsoft featuring a clean intuitive window manager, native terminal, and WSL2." },
  {
    title: "Adobe Photoshop 2024",
    type: "software",
    release_date: "2024",
    overview:
      "The world's premium vector and photo editing suite equipped with generative AI fill, layers, mask effects, and camera raw." },
  {
    title: "MS Office Professional Plus 2024",
    type: "software",
    release_date: "2024",
    overview:
      "Curated desktop collection of essential productivity apps including Word, Excel, PowerPoint, Access, and OutLook." },
  {
    title: "Spotify Premium APK Mod",
    type: "software",
    release_date: "2024",
    overview:
      "Fully unlocked mobile audio streaming package with ad-free unlimited skips, high-fidelity audio options, and offline playback capabilities." },
  {
    title: "IDM (Internet Download Manager) Full Crack",
    type: "software",
    release_date: "2024",
    overview:
      "Hyper-speed browser downloader which accelerates downloading operations by slicing files into parallel packages." },
  {
    title: "Windows 10 Pro LTSC",
    type: "software",
    release_date: "2021",
    overview:
      "Highly optimized, super lightweight Windows build with zero telemetry and unwanted background updates, perfect for gamers." },
  {
    title: "Ubuntu Desktop 24.04 LTS",
    type: "software",
    release_date: "2024",
    overview:
      "The global gold-standard desktop Linux distribution based on Debian, featuring the beautiful GNOME environment & extreme customizability." },
  {
    title: "Minecraft Pocket Edition APK",
    type: "software",
    release_date: "2024",
    overview:
      "Official high-performance mobile sandbox building module, allowing cross-play creative building and survival operations." },
  {
    title: "macOS Sequoia (15.0)",
    type: "software",
    release_date: "2024",
    overview:
      "Apple's flagship workstation operating system featuring iPhone mirroring, deep Apple Intelligence integrations, and refined workspace tiling." },
  {
    title: "Tom and Jerry Classics",
    type: "anime",
    release_date: "1940",
    overview:
      "The legendary, Oscar-winning animated series showcasing the eternal comical rivalry between Tom the cat and Jerry the mouse." },
  {
    title: "Ben 10: Alien Force",
    type: "anime",
    release_date: "2008",
    overview:
      "Action-packed nostalgic animated cartoon series following teenage Ben Tennyson as he protects the earth using the Omnitrix." },
  {
    title: "Adobe Premiere Pro 2024",
    type: "software",
    release_date: "2024",
    overview:
      "Elite professional video timeline editor with multi-cam edits, intelligent speech-to-text transcripts, and custom color wheels." },
];

// Helper to get beautiful, instant thematic cover images for any search entity
const getThematicPlaceholder = (title: string, type?: string): string => {
  const t = (title || "").toLowerCase();
  const cleanType = (type || "").toLowerCase();

  if (
    cleanType === "game" ||
    t.includes("game") ||
    t.includes("play") ||
    t.includes("steam") ||
    t.includes("xbox") ||
    t.includes("nintendo") ||
    t.includes("playstation") ||
    t.includes("gta") ||
    t.includes("theft")
  ) {
    const gameVids = [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611790432322-8636b13e9a44?w=800&q=80&auto=format&fit=crop",
    ];
    const hash = Array.from(title || "").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    return gameVids[hash % gameVids.length];
  }

  if (
    cleanType === "anime" ||
    t.includes("anime") ||
    t.includes("manga") ||
    t.includes("naruto") ||
    t.includes("slayer") ||
    t.includes("titan")
  ) {
    const animeVids = [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&q=80&auto=format&fit=crop",
    ];
    const hash = Array.from(title || "").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    return animeVids[hash % animeVids.length];
  }

  if (
    cleanType === "software" ||
    cleanType === "os" ||
    cleanType === "app" ||
    t.includes("software") ||
    t.includes("apk") ||
    t.includes("os") ||
    t.includes("windows") ||
    t.includes("office") ||
    t.includes("app") ||
    t.includes("pro") ||
    t.includes("builder") ||
    t.includes("coding")
  ) {
    const techVids = [
      "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80&auto=format&fit=crop",
    ];
    const hash = Array.from(title || "").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    return techVids[hash % techVids.length];
  }

  if (
    t.includes("cartoon") ||
    t.includes("toon") ||
    t.includes("disney") ||
    t.includes("pixel") ||
    t.includes("toy") ||
    t.includes("jerry") ||
    t.includes("tom")
  ) {
    const cartoonVids = [
      "https://images.unsplash.com/photo-1601987177651-8edfe6c20009?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80&auto=format&fit=crop",
    ];
    const hash = Array.from(title || "").reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );
    return cartoonVids[hash % cartoonVids.length];
  }

  const genericVids = [
    "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1574267432553-4b4628081524?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80&auto=format&fit=crop",
  ];
  const hash = Array.from(title || "").reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return genericVids[hash % genericVids.length];
};

const preloadedUrls = new Set<string>();
const preloadImage = (url: string | null | undefined) => {
  if (!url) return;
  if (preloadedUrls.has(url)) return;

  preloadedUrls.add(url);

  // Directly trigger browser prefetch immediately in parallel for zero latency
  const img = new Image();
  img.src = url;

  // Then warm up memory cache with IndexedDB record if present
  if (!inlineMemoryCache.has(url)) {
    getCachedImage(url)
      .then((cached) => {
        if (cached) {
          inlineMemoryCache.set(url, cached);
        }
      })
      .catch(() => {});
  }
};

const SafeImage = ({
  src,
  alt,
  className = "",
  fallbackIcon,
  title,
  type,
  priority = false }: {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackIcon: React.ReactNode;
  title: string;
  type?: string;
  priority?: boolean;
}) => {
  const resolvedSrc = src || getThematicPlaceholder(title, type);

  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || inView) return;

    // Intersection Observer for manual lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }, // Load slightly before it comes into view
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority, inView]);

  const [displaySrc, setDisplaySrc] = useState<string | null>(() => {
    if (!resolvedSrc || (!priority && !inView)) return null;
    return inlineMemoryCache.get(resolvedSrc) || resolvedSrc;
  });

  const [hasError, setHasError] = useState(!resolvedSrc);
  const [imageFailed, setImageFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => {
    if (!resolvedSrc) return false;
    return inlineMemoryCache.has(resolvedSrc) || preloadedUrls.has(resolvedSrc);
  });

  useEffect(() => {
    if (!inView && !priority) return;

    if (!resolvedSrc) {
      setHasError(true);
      setDisplaySrc(null);
      setIsLoaded(false);
      return;
    }

    if (imageFailed) {
      setHasError(true);
      setDisplaySrc(null);
      return;
    }

    setHasError(false);
    let isCancelled = false;

    async function loadWithCache() {
      try {
        const cached = await getCachedImage(resolvedSrc!);
        if (isCancelled) return;

        if (cached) {
          setDisplaySrc(cached);
          setIsLoaded(true);
        } else {
          setDisplaySrc(resolvedSrc!);
        }
      } catch (err) {
        if (!isCancelled) {
          setDisplaySrc(resolvedSrc!);
        }
      }
    }

    if (inlineMemoryCache.has(resolvedSrc)) {
      setDisplaySrc(inlineMemoryCache.get(resolvedSrc)!);
      setIsLoaded(true);
    } else {
      loadWithCache();
    }

    return () => {
      isCancelled = true;
    };
  }, [resolvedSrc, inView, priority, imageFailed, title, type]);

  if (hasError) {
    return (
      <div
        className={`w-full h-full bg-gradient-to-br from-[#0c0d19] via-[#10122e] to-[#04050d] border border-white/5 flex flex-col items-center justify-center p-2 text-center relative overflow-hidden group/fallback select-none rounded-[inherit]`}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none opacity-40 animate-pulse" />

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 flex items-center justify-center mb-1.5 text-indigo-400 group-hover/fallback:scale-[1.02] transition-transform duration-[950ms]">
          {fallbackIcon}
        </div>

        <span className="text-[9px] text-white/90 font-black tracking-tight leading-tight uppercase line-clamp-2 max-w-[90%] font-sans">
          {title}
        </span>

        {type && (
          <span className="absolute bottom-2 text-[7px] font-mono font-bold tracking-[0.2em] text-indigo-400/50 uppercase">
            {type}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      ref={imgRef}
      className={`relative w-full h-full overflow-hidden rounded-[inherit] ${
        type === "software" || type === "system" || type === "tool"
          ? "bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] bg-[#f8f9fa] dark:bg-[#1a1c23]/80"
          : "bg-slate-950/20"
      }`}
    >
      {!isLoaded && (
        <div
          className="absolute inset-0 search-result-modal opacity-70 flex items-center justify-center rounded-[inherit] z-0 loading"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%)",
            backgroundSize: "200% 100%",
            animation: "pulse-skeleton 1.5s infinite ease-[cubic-bezier(0.16,1,0.3,1)]" }}
        ></div>
      )}

      {displaySrc && displaySrc.includes("tmdb.org") && (
        <img
          src={displaySrc.replace(/\/w\d+\/|\/original\//, "/w92/")}
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] z-10 ${
            isLoaded
              ? "opacity-0"
              : "opacity-100 filter blur-md scale-[1.02] saturate-150"
          }`}
        />
      )}

      {(inView || priority || displaySrc) && (
        <div
          className={`absolute inset-0 flex items-center justify-center relative w-full h-full ${type === "software" || type === "system" || type === "tool" ? "p-6" : ""}`}
        >
          <img
            src={displaySrc || undefined}
            srcSet={
              displaySrc?.includes("tmdb.org")
                ? `${displaySrc.replace(/\/w\d+\/|\/original\//, "/w342/")} 342w, ${displaySrc.replace(/\/w\d+\/|\/original\//, "/w500/")} 500w, ${displaySrc.replace(/\/w\d+\/|\/original\//, "/w780/")} 780w`
                : undefined
            }
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 15vw"
            alt={alt}
            referrerPolicy="no-referrer"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
            style={{
              ...getSmartFitStyles(
                type === "software" || type === "system" || type === "tool"
                  ? "logo"
                  : "poster",
              ),
              imageRendering: "auto" }}
            className={`${className.replace(/object-cover/g, "")} ${isLoaded ? "opacity-100 scale-100 filter-none" : "opacity-0 scale-95 blur-sm"} transition-all duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] rounded-[inherit] w-full h-full origin-center relative z-20 ${type === "software" || type === "system" || type === "tool" ? "filter drop-shadow-xl" : ""}`}
            onLoad={() => {
              setIsLoaded(true);
              if (src) {
                preloadedUrls.add(src);
                if (displaySrc === src) {
                  saveImageToCache(src).catch(() => {});
                }
              }
            }}
            onError={() => {
              if (!imageFailed) {
                setImageFailed(true);
              } else {
                setHasError(true);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

const TRENDING_RECOMMENDATIONS = [
  {
    id: "movie-oppenheimer",
    title: "Oppenheimer",
    poster_path:
      "https://image.tmdb.org/t/p/w342/8GgZ8UjWgje27v4fX0Z6uYFBux1.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/rM5Z9bT5mE4hG45P67d30f4aA7W.jpg",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, focusing on how it changed the course of human history.",
    release_date: "2023-07-19",
    type: "movie" as const,
    vote_average: 8.1 },
  {
    id: "game-eldenring",
    title: "Elden Ring",
    poster_path:
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co4kbj.jpg",
    backdrop_path:
      "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/scbyg4.jpg",
    overview:
      "A massive open-world fantasy action-RPG from FromSoftware. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    release_date: "2022-02-25",
    type: "game" as const,
    platforms: ["PC", "PS5", "XSX", "PS4"] },
  {
    id: "anime-demonslayer",
    title: "Demon Slayer: Kimetsu no Yaiba",
    poster_path: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
    backdrop_path: "https://cdn.myanimelist.net/images/anime/1908/135431.jpg",
    overview:
      "Tanjirou Kamado is a kindhearted, intelligent boy who lives with his family. Everything changes when a demon slaughters his family, leaving only his sister Nezuko alive as a demon itself.",
    release_date: "2019-04-06",
    type: "anime" as const,
    episodes: 26,
    score: 8.5 },
  {
    id: "movie-spiderman-spiderverse",
    title: "Spider-Man: Across the Spider-Verse",
    poster_path:
      "https://image.tmdb.org/t/p/w342/8VtBz9C-RwhK6mUInDAdRorD921.jpg",
    backdrop_path:
      "https://image.tmdb.org/t/p/original/m99A3pXFsc9W6XmHn1n6A7Gg90S.jpg",
    overview:
      "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People.",
    release_date: "2023-05-31",
    type: "movie" as const,
    vote_average: 8.4 },
];

interface SuggestionItem {
  id: string | number;
  title: string;
  poster_path: string | null;
  poster?: string;
  overview: string;
  release_date: string;
  type:
    | "movie"
    | "game"
    | "anime"
    | "software"
    | "torrents"
    | "unknown"
    | "tv"
    | "system"
    | "tool";
  backdrop_path?: string | null;
  platforms?: string[];
  episodes?: number;
  score?: number;
}

const BENGALI_DOMAINS = [
  "cinefreak.nl",
  "mlsbd.co",
  "moviebaaz.cfd",
  "moviedokan.co",
  "moviedrivebd.com",
  "freedrivemovie.cfd",
  "fojik.site",
  "joya9tv1.com",
  "cinedoze.tv",
  "southfreak.fyi",
  "movienestbd.pics",
];

const TOP_QUALITY_DOMAINS = [
  "4khdhub.one",
  "uhdmovies.food",
  "new3.moviesdrives.my",
  "vegamovies.mq",
  "kmmovies.lol",
  "multishows.top",
  "katmoviehd.cymru",
  "top.xdmovies.wtf",
  "new.cloudmoviez.shop",
  "tamiltvtoons.site",
  "movienestbd.pics",
  "v2.olamovies.mov",
  "ddlbase.com",
  "zinkmovies.today",
  "cinemalux.wiki",
  "cinefreak.nl",
];

const INDIAN_DUBBED_DOMAINS = [
  "newhdmovie2.top",
  "mlfbd.best",
  "bollyflix.ski",
  "a.privatemoviez.surf",
  "new1.hdhub4u.cl",
  "go.india4movies.net",
  "ssrmovies.taxi",
  "downloadhub.lat",
  "moviesleech.rodeo",
  "moviesmod.farm",
  "hdmovieverse.xyz",
  "1tamilmv.cards",
  "allmovieshub.gives",
  "world4ufree.wiki",
  "thenextplanet.net",
];

const isBengaliQuery = (q: string): boolean => {
  if (!q) return false;
  const lower = q.toLowerCase();
  const hasBanglaUnicode = /[\u0980-\u09FF]/.test(q);
  const keywords = [
    "bangla",
    "bengali",
    "kolkata",
    "dhallywood",
    "dhaka",
    "shakib",
    "dev",
    "mimi",
    "jeeth",
    "hoichoi",
    "chorki",
    "bongo",
    "nusraat",
    "apurbo",
    "farhan",
    "mehazabien",
    "tanjin",
    "sourav",
    "uttama",
    "mithun",
    "bengal",
    "rabindra",
    "srabanti",
    "subhashree",
    "purnima",
    "jashim",
  ];
  return hasBanglaUnicode || keywords.some((kw) => lower.includes(kw));
};

const localSuggestionsCache = new Map<string, SuggestionItem[]>();
const localScraperCache = new Map<string, Record<string, any>>();

const GAME_KEYWORDS = [
  "game",
  "play",
  "steam",
  "xbox",
  "nintendo",
  "playstation",
  "rom",
  "retro",
  "gta",
  "fifa",
  "cod",
  "minec",
  "apk mod",
  "cheat",
  "crack game",
  "switch",
  "ps4",
  "ps5",
  "repack",
  "fitgirl",
  "dodi",
  "psp",
  "classic",
  "emulator",
  "console",
  "cyberpunk",
  "witcher",
  "red dead",
  "halo",
  "resident evil",
  "mario",
  "zelda",
  "pokemon",
  "elden ring",
  "god of war",
  "last of us",
  "forza",
  "need for speed",
  "nfs",
  "assassin",
  "call of duty",
  "pubg",
  "free fire",
  "valorant",
  "csgo",
  "counter strike",
  "wwe",
  "ufc",
  "tekken",
  "mortal kombat",
  "far cry",
  "rdr2",
  "sims",
  "roblox",
  "fortnite",
  "genshin",
];
const SOFTWARE_KEYWORDS = [
  "photoshop",
  "office",
  "windows",
  "software",
  "apk",
  "mod",
  "pro",
  "crack",
  "patch",
  "zip",
  "exe",
  "os",
  "operating system",
  "dmg",
  "macos",
  "ubuntu",
  "adobe",
  "idm",
  "driver",
  "activation",
  "activator",
  "antivirus",
  "setup",
  "install",
  "utility",
  "app",
  "license",
  "serial",
  "patch",
  "autocad",
  "premiere",
  "illustrator",
  "visual studio",
  "intellij",
  "acrobat",
  "winrar",
  "7zip",
  "filmora",
  "capcut",
  "vlc",
  "vpn",
  "kaspersky",
  "malwarebytes",
  "ccleaner",
  "vmware",
  "virtualbox",
  "bluestacks",
  "ldplayer",
  "emulator apk",
  "premium apk",
];
const ANIME_KEYWORDS = [
  "anime",
  "manga",
  "ova",
  "crunchyroll",
  "myanimelist",
  "mal",
  "jikan",
  "demon slayer",
  "naruto",
  "one piece",
  "dragon ball",
  "attack on titan",
  "jujutsu kaisen",
  "bleach",
  "death note",
  "boku no hero",
  "my hero academia",
  "fullmetal",
  "gintama",
  "donghua",
  "manhwa",
];
const MOVIE_KEYWORDS = [
  "movie",
  "show",
  "series",
  "season",
  "film",
  "netflix",
  "cinema",
  "bluray",
  "uhd",
  "4k",
  "dual audio",
  "bengali",
  "bangla",
  "dubbed",
  "yts",

  "torrent",
  "ep ",
  "episode",
  "complete",
  "remux",
  "webrip",
  "hdrip",
  "dvd",
  "hdtv",
  "hevc",
  "cinem",
  "theatre",
  "imax",
  "stream",
  "subs",
  "subtitles",
  "hindi",
  "tamil",
  "telugu",
  "hollywood",
  "bollywood",
  "dhallywood",
  "web-dl",
  "rip",
  "x264",
  "x265",
  "1080p",
  "720p",
  "2160p",
  "interstellar",
  "inception",
  "dark knight",
  "avatar",
  "marvel",
  "avengers",
  "titanic",
  "lord of the rings",
  "hobbit",
  "batman",
  "superman",
  "spiderman",
  "iron man",
  "thor",
  "captain america",
  "oppenheimer",
  "breaking bad",
  "game of thrones",
  "stranger things",
  "money heist",
  "squid game",
];

function smartDetectContent(
  norm: string,
): "games" | "software" | "movies" | "anime" | "system" | null {
  const lower = norm.toLowerCase();

  if (
    /\b(windows|linux|ubuntu|macos|ios|android|apk|android os|operating system|os|debian|mint|kali|iso file|bootable)\b/i.test(
      lower,
    )
  )
    return "system";

  if (
    /\b(anime|manga|ova|crunchyroll|myanimelist|funimation|animixplay|zoro)\b/i.test(
      lower,
    )
  )
    return "anime";

  if (
    /\b(season \d+|episode \d+|s\d+e\d+|bluray|1080p|720p|4k|uhd|hevc|x264|x265|movie|series|film|cinema|netflix|hulu|web-dl|webrip|tv|show|shows|movies)\b/i.test(
      lower,
    )
  )
    return "movies";

  if (
    /\b(crack|keygen|repack|\.exe|\.apk|\.dmg|\.iso|setup|v\d+\.\d+|software|app|apps|application|mod|patch|pro|premium)\b/i.test(
      lower,
    ) ||
    /\b(android|apk|mobile app|ipa)\b/i.test(lower)
  )
    return "software";

  if (
    /\b(game|games|gameplay|nintendo|steam|pc game|rom|emulator|switch|ps4|ps5|xbox|fitgirl|dodi|video game)\b/i.test(
      lower,
    )
  )
    return "games";

  // Deep boundary array scans
  if (ANIME_KEYWORDS.some((kw) => lower.includes(kw))) return "anime";
  if (GAME_KEYWORDS.some((kw) => lower.includes(kw))) return "games";
  if (SOFTWARE_KEYWORDS.some((kw) => lower.includes(kw))) return "software";
  if (MOVIE_KEYWORDS.some((kw) => lower.includes(kw))) return "movies";

  return null;
}

// Pre-index the search database into a local cache that is sorted by relevance weight at build/load time
const PRE_INDEXED_PROVIDERS = [...SEARCH_PROVIDERS].sort(
  (a, b) => b.rating - a.rating,
);

const apiRequestCache = new Map<string, any>();

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SmartSkeleton = ({ count, type }: { count: number; type: string }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <motion.div
          key={`skeleton-${idx}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 110, damping: 20, mass: 1,
            delay: idx * 0.04 }}
          
          className="w-full flex flex-col gap-2 relative pointer-events-none"
        >
          <div
            className={`w-full relative overflow-hidden rounded-[16px] xl:rounded-[20px] border border-white/10 ${type === "software" || type === "system" ? "h-48 sm:h-56 md:h-64" : "aspect-[2/3]"} poster-wrapper loading bg-white/[0.03]`}
          >
            <div className="w-full h-full" />
          </div>
          <div className="flex flex-col justify-start items-center text-center px-1">
            <div className="h-3 w-3/4 bg-white/[0.05] rounded mt-1 mb-1 poster-wrapper loading"></div>
            <div className="h-2 w-1/2 bg-white/[0.05] rounded poster-wrapper loading"></div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default function SmartSearch() {
  const [query, setQuery] = useState("");
  useImagePreloader(query);
  const [hasSelectedCategory, setHasSelectedCategory] =
    useState<boolean>(false);
  const localQueryRef = useRef("");

  const debounceTimerDef = useRef<NodeJS.Timeout | null>(null);

  const handleQueryChange = React.useCallback((val: string) => {
    localQueryRef.current = val;
    if (debounceTimerDef.current) {
      clearTimeout(debounceTimerDef.current);
    }
    debounceTimerDef.current = setTimeout(() => {
      if (val.trim().length > 0) {
        setQuery(val);
        setIsSearchExecuted(true);

        // Dynamic category mapping based on user input
        const lowerQuery = val.toLowerCase();
        let newCat = "all";
        if (/\b(movie|film|tv|show|series|watch)\b/i.test(lowerQuery)) {
          newCat = "streaming";
        } else if (/\b(anime|manga|otaku|weeb)\b/i.test(lowerQuery)) {
          newCat = "anime";
        } else if (/\b(game|play|pc|xbox|ps5|nintendo)\b/i.test(lowerQuery)) {
          newCat = "software"; // routing games to software/tools or all
        } else if (
          /\b(bengali|bangla|kolkata|dhaka|natok)\b/i.test(lowerQuery)
        ) {
          setSelectedSubFilter("bengali");
        }
        if (newCat !== "all") {
          setActiveCategory(newCat);
        }

        setHasSelectedCategory(true);
        setShowSuggestions(false);
        setHasSelectedPoster(false);
        setHidePoster(false);
      } else {
        setQuery("");
        setIsSearchExecuted(false);
        setMultiEntities([]);
      }
    }, 500);
  }, []);
  useEffect(() => {
    localQueryRef.current = query;
    if (searchInputRef.current && searchInputRef.current.value !== query) {
      searchInputRef.current.value = query;
    }
  }, [query]);

  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hidePoster, setHidePoster] = useState(false);
  const [hasSelectedPoster, setHasSelectedPoster] = useState(false);
  const [focusedPosterIndex, setFocusedPosterIndex] = useState(-1);
  const [multiEntities, setMultiEntities] = useState<SuggestionItem[]>([]);
  const [visibleEntitiesCount, setVisibleEntitiesCount] = useState(14);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isHoveringSearch, setIsHoveringSearch] = useState(false);

  const [wasCacheHit, setWasCacheHit] = useState(false);
  const [isSearchExecuted, setIsSearchExecuted] = useState(false);
  const [isFetchingPoster, setIsFetchingPoster] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isManualCategory, setIsManualCategory] = useState<boolean>(false);

  // Dispatch search state for Navbar auto-hide logic
  useEffect(() => {
    const isSearchActive = query.trim().length > 0 || isInputFocused || multiEntities.length > 0;
    window.dispatchEvent(new CustomEvent('search-active', { detail: isSearchActive }));
  }, [query, isInputFocused, multiEntities.length]);

  // --- SCROLL: Search Stage ---
  useEffect(() => {
    const handleReset = () => {
      const resetState = () => {
        setQuery("");
        setIsSearchExecuted(false);
        setMultiEntities([]);
        setHidePoster(false);
        setHasSelectedPoster(false);
        setShowSuggestions(false);
        if (searchInputRef.current) {
          searchInputRef.current.value = "";
          searchInputRef.current.blur();
        }
      };

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          resetState();
        });
      } else {
        resetState();
      }
    };
    window.addEventListener("reset-home", handleReset);
    return () => window.removeEventListener("reset-home", handleReset);
  }, []);

  useEffect(() => {
    // Scroll logic completely removed to prevent jumpy layout and search bar hiding while typing
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputFocused]);

  useEffect(() => {
    // debouncedQuery has been successfully refactored out.
  }, []);

  const [activeGroupTab, setActiveGroupTab] = useState<string | null>(null);

  const [allData, setAllData] = useState<PortalItem[]>([]);

  const staticGroups = React.useMemo(() => {
    return [
      { id: "all", tag: "Everything", icon: <Layers size={14} /> },
      { id: "movie", tag: "Movies/TV", icon: <Clapperboard size={14} /> },
      { id: "game", tag: "Video Games", icon: <Gamepad2 size={14} /> },
      { id: "software", tag: "Software App", icon: <Package size={14} /> },
    ];
  }, []);

  const currentGroup =
    staticGroups.find((g) => g.id === activeGroupTab) || staticGroups[0];
  const selectedEntity = multiEntities?.length > 0 ? multiEntities[0] : null;

  const fetchExactPoster = React.useCallback(
    async (searchQuery: string, catId: string, prefetchOnly = false) => {
      let mySession: number | null = null;
      if (!prefetchOnly) mySession = ++fetchSessionId.current;
      if (!searchQuery.trim()) return;
      const cacheKey = `${catId}-${searchQuery.toLowerCase().trim()}`;
      const allCacheKey = `all-${searchQuery.toLowerCase().trim()}`;

      if (apiRequestCache.has(cacheKey)) {
        if (!prefetchOnly && fetchSessionId.current === mySession)
          setMultiEntities(apiRequestCache.get(cacheKey));
        return;
      } else if (catId !== "all" && apiRequestCache.has(allCacheKey)) {
        // The user requested: "Fix the filtering logic so that selecting 'Software App' correctly filters the current local state instead of failing to populate the grid."
        const allData = apiRequestCache.get(allCacheKey) || [];
        const targetTypes =
          catId === "software" || catId === "system"
            ? ["software", "system"]
            : catId === "game" || catId === "games"
              ? ["game"]
              : catId === "anime"
                ? ["anime"]
                : ["movie", "tv", "torrents"];
        const filtered = allData.filter((m: any) =>
          targetTypes.includes(m.type),
        );
        console.log(
          `[SmartSearch Data Fetch] Local filter for ${catId} found ${filtered.length} matches from 'all' cache.`,
        );
        apiRequestCache.set(cacheKey, filtered);
        if (!prefetchOnly && fetchSessionId.current === mySession)
          setMultiEntities(filtered);
        return;
      }

      if (!prefetchOnly) setIsFetchingPoster(true);

      // LocalStorage Primary Cache Check
      const localStoreKey = `ls_search_${catId}_${searchQuery.toLowerCase().trim()}`;
      try {
        const stored = localStorage.getItem(localStoreKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            parsed.timestamp &&
            Date.now() - parsed.timestamp < 1000 * 60 * 60 * 6 &&
            parsed.data &&
            parsed.data.length > 0
          ) {
            apiRequestCache.set(cacheKey, parsed.data);
            if (!prefetchOnly && fetchSessionId.current === mySession) {
              setMultiEntities(parsed.data);
              setIsFetchingPoster(false);
            }
            return; // STALE CHECK PASSED: STOP EXECUTION
          }
        }
      } catch (e) {
        // Ignored
      }

      const indexedDbCache = await getCachedSearchResults(
        searchQuery.toLowerCase().trim(),
        catId,
      );
      let servedFromCache = false;
      if (indexedDbCache && indexedDbCache.length > 0) {
        apiRequestCache.set(cacheKey, indexedDbCache);
        if (!prefetchOnly && fetchSessionId.current === mySession) {
          setMultiEntities(indexedDbCache);
          setIsFetchingPoster(false);
          servedFromCache = true;
        }
      }

      const pureQuery =
        searchQuery
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim() || searchQuery;

      const processDataInWorker = async (
        results: any[],
        query: string,
        type: string,
      ): Promise<any[]> => {
        return new Promise((resolve) => {
          const worker = new Worker(
            new URL("../workers/searchWorker.ts", import.meta.url),
            { type: "module" },
          );
          worker.onmessage = (e) => {
            resolve(e.data.results);
            worker.terminate();
          };
          worker.postMessage({ query, type, results });
        });
      };

      try {
        if (catId === "all") {
          const smartCatType = smartDetectContent(searchQuery.toLowerCase());
          const searchLower = searchQuery.toLowerCase().trim();

          // Incremental updates variables
          let accumulatedMatches: any[] = [];

          const processData = (docs: any[], type: string) => {
            const newMatches = docs.map((i: any) => ({ ...i, type }));
            accumulatedMatches = [...accumulatedMatches, ...newMatches].filter(
              (i) => i && i.title,
            );

            // Remove duplicates by title and poster
            const seenTitles = new Set();
            const seenPosters = new Set();
            accumulatedMatches = accumulatedMatches.filter((match) => {
              const t = match.title.toLowerCase();
              const p = match.poster || match.poster_path;
              if (seenTitles.has(t)) return false;
              if (p && seenPosters.has(p)) return false;
              seenTitles.add(t);
              if (p) seenPosters.add(p);
              return true;
            });

            // Advanced Sorting: Smart Category > Exact Match > Title Start > Release Date
            let finalMatches: any[] = [...accumulatedMatches];
            const qStr = searchLower.trim();
            finalMatches.sort((a, b) => {
              const aT = a.title.toLowerCase();
              const bT = b.title.toLowerCase();

              // Prioritize smart category
              if (smartCatType) {
                const aIsSmart =
                  a.type === smartCatType ||
                  (smartCatType === "system" && a.type === "software");
                const bIsSmart =
                  b.type === smartCatType ||
                  (smartCatType === "system" && b.type === "software");
                if (aIsSmart && !bIsSmart) return -1;
                if (!aIsSmart && bIsSmart) return 1;
              }

              // Exact match
              const aExact = aT === qStr;
              const bExact = bT === qStr;
              if (aExact && !bExact) return -1;
              if (!aExact && bExact) return 1;

              // Posters
              const aHasImg = !!(
                a.poster ||
                a.poster_path ||
                a.icon_domain ||
                a.image_url
              );
              const bHasImg = !!(
                b.poster ||
                b.poster_path ||
                b.icon_domain ||
                b.image_url
              );
              if (aHasImg && !bHasImg) return -1;
              if (!aHasImg && bHasImg) return 1;

              // Starts with
              const aStarts = aT.startsWith(qStr);
              const bStarts = bT.startsWith(qStr);
              if (aStarts && !bStarts) return -1;
              if (!aStarts && bStarts) return 1;

              // Includes
              const aIncludes = aT.includes(qStr);
              const bIncludes = bT.includes(qStr);
              if (aIncludes && !bIncludes) return -1;
              if (!aIncludes && bIncludes) return 1;

              // Date
              const dA =
                a.release_date && a.release_date !== "Unknown"
                  ? new Date(a.release_date).getTime()
                  : 0;
              const dB =
                b.release_date && b.release_date !== "Unknown"
                  ? new Date(b.release_date).getTime()
                  : 0;
              return dB - dA;
            });

            console.log(
              `[SmartSearch Data Fetch] Smart Mode, Query: ${searchQuery}, Found: ${finalMatches.length} matches.`,
            );

            accumulatedMatches = finalMatches.slice(0, 80);

            const formattedMatches = accumulatedMatches.map(
              (bestMatch, idx) => ({
                id: `${bestMatch.type}-${bestMatch.id || Date.now() + idx}`,
                title: bestMatch.title,
                poster_path: bestMatch.poster_path || null,
                overview:
                  bestMatch.overview ||
                  "Extended description available across index below.",
                release_date: bestMatch.release_date || "Unknown",
                backdrop_path: bestMatch.backdrop_path,
                type: bestMatch.type }),
            );

            if (!prefetchOnly && fetchSessionId.current === mySession) {
              setMultiEntities(formattedMatches);
            }
            if (formattedMatches.length > 0) {
              preloadImage(formattedMatches[0].poster_path);
            }
          };

          const fetchAndProcess = async (url: string, type: string) => {
            try {
              const cachedResults = await getCachedSearchResults(
                pureQuery,
                type,
              );

              // Verify cache robustness (force re-fetch if we still have fallback clearbit/favicons)
              let hasWeakCache = false;
              if (cachedResults && cachedResults.length > 0) {
                hasWeakCache = cachedResults.some(
                  (r) =>
                    r.poster_path &&
                    (r.poster_path.includes("logo.clearbit.com") ||
                      r.poster_path.includes("s2/favicons")),
                );
              }

              if (cachedResults && cachedResults.length > 0 && !hasWeakCache) {
                console.log(
                  `[SmartSearch Data Fetch] Resolving ${type} from IndexedDB Cache`,
                );
                processData(cachedResults, type);
                return;
              }

              console.log(
                `[SmartSearch Data Fetch] Fetching ${type} from ${url}`,
              );
              const res = await fetch(url);
              if (res.ok) {
                const data = await res.json();
                let results = data.results || [];

                await Promise.all(
                  results.map(async (item: any) => {
                    if (item.poster_path && item.title) {
                      saveMappedIconUrl(item.title, item.poster_path);
                    } else if (!item.poster_path && item.title) {
                      const cachedPath = await getMappedIconUrl(item.title);
                      if (cachedPath) item.poster_path = cachedPath;
                    }
                  }),
                );

                results = await processDataInWorker(results, pureQuery, type);

                console.log(
                  `[SmartSearch Data Fetch] Raw response for ${type}:`,
                  results,
                );
                processData(results, type);
              } else {
                console.error(
                  `[SmartSearch Data Fetch] Failed response for ${type}`,
                  res.status,
                );
              }
            } catch (e) {
              console.error(
                `[SmartSearch Data Fetch] Error fetching ${type}:`,
                e,
              );
            }
          };

          const promises = [
            fetchAndProcess(
              `/api/search/movie?query=${encodeURIComponent(pureQuery)}`,
              "movie",
            ),
            fetchAndProcess(
              `/api/search/game?query=${encodeURIComponent(pureQuery)}`,
              "game",
            ),
            fetchAndProcess(
              `/api/search/anime?query=${encodeURIComponent(pureQuery)}`,
              "anime",
            ),
            fetchAndProcess(
              `/api/search/software?query=${encodeURIComponent(pureQuery)}`,
              smartCatType === "system" ? "system" : "software",
            ),
          ];

          await Promise.allSettled(promises);

          if (accumulatedMatches.length > 0) {
            const finalFormattedMatches = accumulatedMatches.map((m, idx) => ({
              id: `${m.type}-${m.id || Date.now() + idx}`,
              title: m.title,
              poster_path: m.poster_path || null,
              overview: m.overview || "",
              release_date: m.release_date || "Unknown",
              backdrop_path: m.backdrop_path,
              type: m.type }));
            apiRequestCache.set(cacheKey, finalFormattedMatches);
            try {
              localStorage.setItem(
                localStoreKey,
                JSON.stringify({
                  timestamp: Date.now(),
                  data: finalFormattedMatches }),
              );
            } catch (e) {}
          } else {
            apiRequestCache.set(cacheKey, []);
          }
        } else {
          let apiCat = catId;
          if (catId === "torrents" || catId === "all" || catId === "movies")
            apiCat = "movie";
          else if (catId === "games") apiCat = "game";
          else if (catId === "anime") apiCat = "anime";
          else if (catId === "software" || catId === "system")
            apiCat = "software";

          let results = [];
          const cachedResults = await getCachedSearchResults(pureQuery, apiCat);

          let hasWeakCache = false;
          if (cachedResults && cachedResults.length > 0) {
            hasWeakCache = cachedResults.some(
              (r) =>
                r.poster_path &&
                (r.poster_path.includes("logo.clearbit.com") ||
                  r.poster_path.includes("s2/favicons")),
            );
          }

          if (cachedResults && cachedResults.length > 0 && !hasWeakCache) {
            console.log(
              `[SmartSearch Data Fetch] Resolving ${apiCat} from IndexedDB Cache`,
            );
            results = cachedResults;
          }

          // Background revalidation
          try {
            const res = await fetch(
              `/api/search/${apiCat}?query=${encodeURIComponent(pureQuery)}`,
            );
            if (res.ok) {
              const data = await res.json();
              let freshResults = data.results || [];
              if (freshResults.length > 0) {
                await Promise.all(
                  freshResults.map(async (item: any) => {
                    if (item.poster_path && item.title)
                      saveMappedIconUrl(item.title, item.poster_path);
                    else if (!item.poster_path && item.title) {
                      const cachedPath = await getMappedIconUrl(item.title);
                      if (cachedPath) item.poster_path = cachedPath;
                    }
                  }),
                );
                freshResults = await processDataInWorker(
                  freshResults,
                  pureQuery,
                  apiCat,
                );
                if (
                  !results ||
                  results.length === 0 ||
                  hasWeakCache ||
                  servedFromCache
                ) {
                  results = freshResults;
                }
              }
            }
          } catch (e) {
            console.error(
              `[SmartSearch Data Fetch] Background revalidation failed for ${apiCat}`,
            );
          }

          if (results && results.length > 0) {
            let fallbackType = "movie";
            if (apiCat === "game") fallbackType = "game";
            if (apiCat === "anime") fallbackType = "anime";
            if (apiCat === "software")
              fallbackType = catId === "system" ? "system" : "software";

            const searchLower = searchQuery.toLowerCase().trim();
            let filteredResults = results.filter((i: any) => i && i.title);

            // Removing duplicates by title and poster
            const seenTitles = new Set();
            const seenPosters = new Set();
            filteredResults = filteredResults.filter((match: any) => {
              const t = match.title.toLowerCase();
              const p = match.poster || match.poster_path;
              if (seenTitles.has(t)) return false;
              if (p && seenPosters.has(p)) return false;
              seenTitles.add(t);
              if (p) seenPosters.add(p);
              return true;
            });

            const qStr = searchQuery.toLowerCase().trim();
            filteredResults.sort((a: any, b: any) => {
              const aT = a.title.toLowerCase();
              const bT = b.title.toLowerCase();

              // Exact match
              const aExact = aT === qStr;
              const bExact = bT === qStr;
              if (aExact && !bExact) return -1;
              if (!aExact && bExact) return 1;

              // Posters
              const aHasImg = !!(
                a.poster ||
                a.poster_path ||
                a.icon_domain ||
                a.image_url
              );
              const bHasImg = !!(
                b.poster ||
                b.poster_path ||
                b.icon_domain ||
                b.image_url
              );
              if (aHasImg && !bHasImg) return -1;
              if (!aHasImg && bHasImg) return 1;

              // Starts with
              const aStarts = aT.startsWith(qStr);
              const bStarts = bT.startsWith(qStr);
              if (aStarts && !bStarts) return -1;
              if (!aStarts && bStarts) return 1;

              // Includes
              const aIncludes = aT.includes(qStr);
              const bIncludes = bT.includes(qStr);
              if (aIncludes && !bIncludes) return -1;
              if (!aIncludes && bIncludes) return 1;

              // Date
              const dA =
                a.release_date && a.release_date !== "Unknown"
                  ? new Date(a.release_date).getTime()
                  : 0;
              const dB =
                b.release_date && b.release_date !== "Unknown"
                  ? new Date(b.release_date).getTime()
                  : 0;
              return dB - dA;
            });

            // Bypassing strict matching filter as backend proxy APIs already filter correctly by search query and this drops valid acronym matches (like 'IDM')
            console.log(
              `[SmartSearch Data Fetch] Category: ${apiCat}, Query: ${searchQuery}, Found: ${filteredResults.length} matches.`,
            );

            const formattedMatches = filteredResults
              .slice(0, 40)
              .map((bestMatch: any, idx_key: number) => ({
                id: `${fallbackType}-${bestMatch.id || Date.now() + idx_key}`,
                title: bestMatch.title,
                poster_path: bestMatch.poster_path || null,
                overview:
                  bestMatch.overview ||
                  "Extended description available across index below.",
                release_date: bestMatch.release_date || "Unknown",
                backdrop_path: bestMatch.backdrop_path,
                type: fallbackType as SuggestionItem["type"] }));

            apiRequestCache.set(cacheKey, formattedMatches);
            try {
              localStorage.setItem(
                localStoreKey,
                JSON.stringify({
                  timestamp: Date.now(),
                  data: formattedMatches }),
              );
            } catch (e) {}
            if (!prefetchOnly && fetchSessionId.current === mySession) {
              setMultiEntities(formattedMatches);
            }
            if (formattedMatches.length > 0) {
              preloadImage(formattedMatches[0].poster_path);
              preloadImage(formattedMatches[0].backdrop_path);
            }
          } else {
            if (catId !== "all") {
              console.log(
                `[SmartSearch Data Fetch] No results found for ${apiCat}, performing fallback search for 'all'`,
              );
              if (!prefetchOnly && fetchSessionId.current === mySession) {
                setActiveGroupTab("all");
                fetchExactPoster(searchQuery, "all");
              } else if (prefetchOnly) {
                fetchExactPoster(searchQuery, "all", true);
              }
              return; // Skip cache setting, rely on the fallback call
            }
            apiRequestCache.set(cacheKey, []);
            if (!prefetchOnly && fetchSessionId.current === mySession)
              setMultiEntities([]);
          }
        }
      } catch (e) {
        console.error(e);
        if (!prefetchOnly && fetchSessionId.current === mySession)
          setMultiEntities([]);
      } finally {
        if (!prefetchOnly && fetchSessionId.current === mySession)
          setIsFetchingPoster(false);
      }
    },
    [],
  );

  // Removed live search on debouncedQuery to prevent page logic jumps while typing

  const lastSearchedQuery = useRef<string>("");
  const fetchSessionId = useRef<number>(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const isDark = true;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 150;
      if (scrolled !== isScrolledRef.current) {
        isScrolledRef.current = scrolled;
        setIsScrolled(scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [selectedSubFilter, setSelectedSubFilter] = useState<string>("all");
  const [requireActiveSeeders, setRequireActiveSeeders] =
    useState<boolean>(false);
  const [requireMinResolution, setRequireMinResolution] =
    useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [smartMode, setSmartMode] = useState<boolean>(true);

  // Intelligently detect the exact metadata title from suggestions, or strip common download noise (crack, torrent, repack)
  const smartDetectedQuery = React.useMemo(() => {
    if (!query) return "";
    const trimmed = query.trim();
    if (trimmed.length === 0) return "";

    if (selectedEntity) {
      return selectedEntity.title;
    }

    // Exact auto detection match using suggestions list
    if (suggestions.length > 0) {
      const firstSug = suggestions[0];
      const typed = trimmed.toLowerCase();
      const firstTitle = firstSug.title.toLowerCase();

      // If suggestions contain first element that is a close semantic match, return its official clean title
      if (
        firstTitle.includes(typed) ||
        typed.includes(firstTitle) ||
        firstSug.title
          .split(/\s+/)
          .some((w) => w.length > 3 && typed.includes(w.toLowerCase()))
      ) {
        return firstSug.title;
      }
    }

    // Advanced search string cleaning to extract pure entity name (film name, game name, software name)
    let cleaned = trimmed;
    cleaned = cleaned.replace(/\.(zip|rar|exe|dmg|apk|iso|mp4|mkv)\b/gi, "");
    cleaned = cleaned.replace(
      /\b(1080p|720p|2160p|4k|uhd|bluray|hevc|x264|x265|h264|h265|hdtv|webrip|web-dl|rip|bdrip|brrip|dual audio|eng|hindi|bengali|bangla|dubbed|multi)\b/gi,
      "",
    );
    cleaned = cleaned.replace(
      /\b(download|free|torrent|magnet|direct link|google drive|gdrive|crack|cracked|patch|repack|fitgirl|dodi|unlocked|full version|activation|serial key|key|patched|skidrow|codex|flt|cpy)\b/gi,
      "",
    );
    cleaned = cleaned.replace(/\s+/g, " ").trim();

    return cleaned || trimmed;
  }, [query, selectedEntity, suggestions]);

  const finalSearchQuery = React.useMemo(() => {
    // Priority: User's typed query -> Poster's title -> Fallback
    const base = query.trim() ? query : (hasSelectedPoster && selectedEntity?.title ? selectedEntity.title : "");
    return (
      base
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim() || base
    );
  }, [query, hasSelectedPoster, selectedEntity]);

  // Dynamically detect search vertical based on query, entity type, and suggestions
  const detectedFilterType = React.useMemo(() => {
    if (!query || query.trim().length === 0) return null;

    if (hasSelectedCategory && activeGroupTab) {
      if (activeGroupTab === "movie") return "movies";
      if (activeGroupTab === "game") return "games";
      if (activeGroupTab === "software") return "software";
    }

    if (selectedEntity) {
      if (selectedEntity.type === "movie" || selectedEntity.type === "anime")
        return "movies";
      if (selectedEntity.type === "game") return "games";
      if (selectedEntity.type === "software") return "software";
    }

    if (hasSelectedPoster && multiEntities.length === 1) {
      const entity = multiEntities[0];
      if (
        entity.type === "movie" ||
        entity.type === "anime" ||
        entity.type === "tv"
      )
        return "movies";
      if (entity.type === "game") return "games";
      if (entity.type === "software") return "software";
    }

    // Fallback checks using suggestions list
    const mCount = suggestions.filter(
      (s) => s.type === "movie" || s.type === "anime",
    ).length;
    const gCount = suggestions.filter((s) => s.type === "game").length;
    const sCount = suggestions.filter((s) => s.type === "software").length;

    if (mCount > 0 || gCount > 0 || sCount > 0) {
      if (mCount >= gCount && mCount >= sCount) return "movies";
      if (gCount >= mCount && gCount >= sCount) return "games";
      if (sCount >= mCount && sCount >= gCount) return "software";
    }

    // Heuristics using query text
    const norm = query.toLowerCase().trim();

    // Expanded Smart Detection AI Heuristics
    const detect = smartDetectContent(norm);
    if (detect === "movies" || isBengaliQuery(query)) return "movies";
    if (detect) return detect;

    // Fallback checks on active category
    if (
      activeCategory === "movies" ||
      activeCategory === "anime" ||
      activeCategory === "torrents" ||
      activeCategory === "streaming"
    ) {
      return "movies";
    }
    if (activeCategory === "games") {
      return "games";
    }
    if (activeCategory === "software") {
      return "software";
    }

    return null; // Return null if none of the above are matched! This will hide the filter block.
  }, [
    query,
    selectedEntity,
    suggestions,
    activeCategory,
    hasSelectedPoster,
    multiEntities,
  ]);

  // Reset filter when type changes so we don't have residual keys
  useEffect(() => {
    setSelectedSubFilter("all");
  }, [detectedFilterType]);

  const activeFiltersList = React.useMemo(() => {
    if (detectedFilterType === "games") {
      return [
        {
          id: "all",
          label: "All Mirrors",
          icon: Layers,
          color: "hover:border-indigo-500/40" },
        {
          id: "pc_games",
          label: "PC Repacks",
          icon: Gamepad2,
          color: "hover:border-emerald-500/40" },
        {
          id: "android_games",
          label: "Android APKs",
          icon: Smartphone,
          color: "hover:border-amber-500/40" },
        {
          id: "playstation",
          label: "PlayStation ROMs",
          icon: Zap,
          color: "hover:border-sky-500/40" },
        {
          id: "xbox",
          label: "Xbox ISOs",
          icon: Cpu,
          color: "hover:border-fuchsia-500/40" },
        {
          id: "nintendo",
          label: "Nintendo Emulation",
          icon: CircleDot,
          color: "hover:border-rose-500/40" },
      ];
    }

    if (detectedFilterType === "software") {
      return [
        {
          id: "all",
          label: "All Platforms",
          icon: Layers,
          color: "hover:border-indigo-500/40" },
        {
          id: "pc_software",
          label: "Win/Mac Installers",
          icon: Monitor,
          color: "hover:border-emerald-500/40" },
        {
          id: "android_apk",
          label: "Android Apps",
          icon: Smartphone,
          color: "hover:border-amber-500/40" },
        {
          id: "operating_system",
          label: "OS ISOs",
          icon: Settings,
          color: "hover:border-sky-500/40" },
      ];
    }

    if (detectedFilterType === "movies" || detectedFilterType === "anime") {
      return [
        {
          id: "all",
          label: "All Streams/Downloads",
          icon: Layers,
          color: "hover:border-indigo-500/40" },
        {
          id: "4k_uhd",
          label: "4K UHD Quality",
          icon: Sparkles,
          color: "hover:border-amber-500/40" },
        {
          id: "bengali",
          label: "Bangladeshi Region",
          icon: Clapperboard,
          color: "hover:border-emerald-500/40" },
        {
          id: "indian_dubbed",
          label: "1080p / General",
          icon: Globe,
          color: "hover:border-blue-500/40" },
        {
          id: "torrent",
          label: "Torrents",
          icon: Flame,
          color: "hover:border-red-500/40" },
      ];
    }

    return [];
  }, [detectedFilterType]);

  // Keyboard shortcut listener to focus search box instantly when "/" or "Ctrl+K" is pressed
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input, textarea, or contentEditable element
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        if (
          tagName === "input" ||
          tagName === "textarea" ||
          (activeElement as HTMLElement).isContentEditable
        ) {
          // If already in the search input and they press "Escape", blur it for supreme navigation flow
          if (activeElement === searchInputRef.current && e.key === "Escape") {
            searchInputRef.current?.blur();
          }
          return;
        }
      }

      // Check for forward slash "/"
      if (e.key === "/") {
        e.preventDefault();
        setQuery("");
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Arrow key grid navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if no grid to navigate or poster already selected
      if (multiEntities.length === 0 || hasSelectedPoster) {
        if (focusedPosterIndex !== -1) setFocusedPosterIndex(-1);
        return;
      }

      if (e.key === "ArrowRight") {
        setFocusedPosterIndex((prev) =>
          prev < multiEntities.length - 1 ? prev + 1 : prev,
        );
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        setFocusedPosterIndex((prev) => (prev > 0 ? prev - 1 : 0));
        e.preventDefault();
      } else if (e.key === "ArrowDown") {
        const columns =
          window.innerWidth >= 1024
            ? 6
            : window.innerWidth >= 768
              ? 5
              : window.innerWidth >= 640
                ? 4
                : 3;
        setFocusedPosterIndex((prev) => {
          if (prev === -1) return 0;
          const next = prev + columns;
          return next < multiEntities.length ? next : prev;
        });
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        const columns =
          window.innerWidth >= 1024
            ? 6
            : window.innerWidth >= 768
              ? 5
              : window.innerWidth >= 640
                ? 4
                : 3;
        setFocusedPosterIndex((prev) => {
          if (prev === -1) return 0;
          const next = prev - columns;
          return next >= 0 ? next : prev;
        });
        e.preventDefault();
      } else if (
        e.key === "Enter" &&
        focusedPosterIndex >= 0 &&
        focusedPosterIndex < multiEntities.length
      ) {
        const entity = multiEntities[focusedPosterIndex];
        const catId =
          entity.type === "movie"
            ? "movies"
            : entity.type === "software"
              ? "software"
              : entity.type === "anime"
                ? "anime"
                : "games";
        setActiveCategory(catId);
        setIsManualCategory(true);
        setMultiEntities([entity]);
        setHasSelectedPoster(true);
        setFocusedPosterIndex(-1);
        searchInputRef.current?.blur(); // drop focus from input
        e.preventDefault();
        e.stopPropagation(); // prevent input field form submission
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [multiEntities, hasSelectedPoster, focusedPosterIndex]);

  // Pre-indexed database local cache sorted by relevance weight (rating) at build/load time
  const [filteredProviders, setFilteredProviders] = useState<SearchProvider[]>(
    PRE_INDEXED_PROVIDERS,
  );
  const workerRef = useRef<{ worker: any; port: any } | null>(null);

  useEffect(() => {
    // Build time inline Web Worker instantiation using an isolated Blob URL
    const workerCode = `
      let ports = [];
      let activeProcessId = 0;

      function initPort(port) {
        port.onmessage = function(e) {
          handleMessage(e.data, function(response) {
            port.postMessage(response);
          });
        };
      }

      if (typeof self.onconnect !== "undefined") {
        self.onconnect = function(e) {
          const port = e.ports[0];
          ports.push(port);
          initPort(port);
        };
      }

      self.onmessage = function(e) {
        handleMessage(e.data, function(response) {
          self.postMessage(response);
        });
      };

      function handleMessage(data, sendResponse) {
        const { 
          query, 
          activeCategory, 
          selectedSubFilter, 
          providerWeights, 
          filterEmptyResults, 
          scraperStatuses,
          searchProviders,
          bengaliDomains,
          topQualityDomains,
          isBengali,
          detectedFilterType
        } = data;

        const queryStr = (query || "").trim().toLowerCase();
        const filtered = [];

        for (let idx = 0; idx < searchProviders.length; idx++) {
          const provider = searchProviders[idx];
          const domainLower = provider.domain.toLowerCase();
          const descriptionLower = (provider.description || "").toLowerCase();
          const tagsLower = (provider.tags || []).map(t => t.toLowerCase());
          
          if (activeCategory !== "all" && provider.category !== activeCategory) {
            if (activeCategory === "streaming") {
              const isStreamDom = [
                "cinefreak.nl", "cinedoze.tv", "cinemalux.skin", "new1.hdhub4u.cl", "hdhub4u.tv", 
                "goplay.su", "kisskh.id", "asiaflix.net", "flixer.su", "moviebaaz.cfd"
              ].includes(domainLower);
              const hasStreamTags = tagsLower.some(t => 
                t.includes("stream") || t.includes("streaming") || t.includes("player") || t.includes("live")
              );
              const hasStreamText = descriptionLower.includes("stream") || 
                                     descriptionLower.includes("live") || 
                                     descriptionLower.includes("online") || 
                                     descriptionLower.includes("player");
              if (!isStreamDom && !hasStreamTags && !hasStreamText) {
                continue;
              }
            } else {
              continue;
            }
          }

          let subFilterMatch = true;

          if (detectedFilterType === "games") {
            if (provider.category !== "games") {
              subFilterMatch = false;
            } else if (selectedSubFilter === "pc_games") {
              const isPC = [
                "fitgirl-repacks.site", "dodi-repacks.download", "ovagames.com", 
                "steamrip.com", "gogunlocked.com", "steamunlocked.org", "repack-games.com", 
                "steamgg.net", "ankergames.net", "playzip.com", "igg-games.com"
              ].includes(domainLower);
              const hasPCTags = tagsLower.some(t => t.includes("pc") || t.includes("steam") || t.includes("repack") || t.includes("install") || t.includes("windows") || t.includes("iso"));
              const hasPCText = descriptionLower.includes("pc") || descriptionLower.includes("steam") || descriptionLower.includes("windows") || descriptionLower.includes("installation");
              if (!isPC && !hasPCTags && !hasPCText) subFilterMatch = false;
            } else if (selectedSubFilter === "android_games") {
              const isAndroid = ["liteapks.com", "modyolo.com", "an1.com", "5play.org", "getmodsapk.com", "apkpure.com", "apkmirror.com"].includes(domainLower);
              const hasAndroidTags = tagsLower.some(t => t.includes("android") || t.includes("apk") || t.includes("mobile") || t.includes("phone"));
              const hasAndroidText = descriptionLower.includes("android") || descriptionLower.includes("apk") || descriptionLower.includes("mobile") || descriptionLower.includes("phone");
              if (!isAndroid && !hasAndroidTags && !hasAndroidText) subFilterMatch = false;
            } else if (selectedSubFilter === "playstation")  else if (selectedSubFilter === "xbox") {
              const hasXboxTags = tagsLower.some(t => t.includes("xbox") || t.includes("iso") || t.includes("360") || t.includes("rom"));
              const hasXboxText = descriptionLower.includes("xbox") || descriptionLower.includes("iso") || descriptionLower.includes("360") || descriptionLower.includes("rom");
              if (!hasXboxTags && !hasXboxText) subFilterMatch = false;
            } else if (selectedSubFilter === "nintendo") {
              const hasNintTags = tagsLower.some(t => t.includes("nintendo") || t.includes("switch") || t.includes("3ds") || t.includes("emulator") || t.includes("rom"));
              const hasNintText = descriptionLower.includes("nintendo") || descriptionLower.includes("switch") || descriptionLower.includes("3ds") || descriptionLower.includes("emulator") || descriptionLower.includes("rom");
              if (!hasNintTags && !hasNintText) subFilterMatch = false;
            }
          } else if (detectedFilterType === "software") {
            if (provider.category !== "software") {
              subFilterMatch = false;
            } else if (selectedSubFilter === "pc_software") {
              const isPC = ["filecr.com", "getintopc.com", "taiwebs.com", "crackingcity.com", "softpedia.com", "filehorse.com", "filehippo.com"].includes(domainLower);
              const hasPCTags = tagsLower.some(t => t.includes("pc") || t.includes("windows") || t.includes("desktop") || t.includes("creative") || t.includes("utility") || t.includes("setup") || t.includes("installer"));
              const hasPCText = descriptionLower.includes("pc") || descriptionLower.includes("windows") || descriptionLower.includes("desktop") || descriptionLower.includes("creative") || descriptionLower.includes("utility") || descriptionLower.includes("setup") || descriptionLower.includes("installer");
              if (!isPC && !hasPCTags && !hasPCText) subFilterMatch = false;
            } else if (selectedSubFilter === "android_apk") {
              const isAndroid = ["apkmirror.com", "apkpure.com", "liteapks.com", "modyolo.com", "an1.com", "5play.org", "getmodsapk.com"].includes(domainLower);
              const hasAndroidTags = tagsLower.some(t => t.includes("apk") || t.includes("android") || t.includes("mobile") || t.includes("mod"));
              const hasAndroidText = descriptionLower.includes("apk") || descriptionLower.includes("android") || descriptionLower.includes("mobile") || descriptionLower.includes("mod");
              if (!isAndroid && !hasAndroidTags && !hasAndroidText) subFilterMatch = false;
            } else if (selectedSubFilter === "operating_system") {
              const isOS = ["filecr.com", "getintopc.com", "taiwebs.com"].includes(domainLower);
              const hasOSTags = tagsLower.some(t => t.includes("os") || t.includes("operating") || t.includes("windows 11") || t.includes("windows 10") || t.includes("macos") || t.includes("ubuntu") || t.includes("linux") || t.includes("iso"));
              const hasOSText = descriptionLower.includes("os") || descriptionLower.includes("operating system") || descriptionLower.includes("windows 11") || descriptionLower.includes("windows 10") || descriptionLower.includes("macos") || descriptionLower.includes("ubuntu") || descriptionLower.includes("linux") || descriptionLower.includes("iso");
              if (!isOS && !hasOSTags && !hasOSText) subFilterMatch = false;
            }
          } else {
            // Default: movies
            if (selectedSubFilter === "bengali") {
              if (!bengaliDomains.includes(domainLower)) subFilterMatch = false;
            } else if (selectedSubFilter === "4k_uhd") {
              const is4KDomain = topQualityDomains.includes(domainLower);
              const has4KTags = tagsLower.some(t => 
                t.includes("4k") || t.includes("uhd") || t.includes("dolby") || 
                t.includes("hdr") || t.includes("atmos") || t.includes("10-bit") || t.includes("crisp")
              );
              const has4KText = descriptionLower.includes("4k") || 
                                 descriptionLower.includes("uhd") || 
                                 descriptionLower.includes("ultra-high") || 
                                 descriptionLower.includes("atmos") || 
                                 descriptionLower.includes("hevc 10-bit");
              if (!is4KDomain && !has4KTags && !has4KText) subFilterMatch = false;
            } else if (selectedSubFilter === "streaming") {
              const isStreamDomain = [
                "cinefreak.nl", "cinedoze.tv", "cinemalux.skin", "new1.hdhub4u.cl", "hdhub4u.tv", 
                "goplay.su", "kisskh.id", "asiaflix.net", "flixer.su", "moviebaaz.cfd"
              ].includes(domainLower);
              const hasStreamTags = tagsLower.some(t => 
                t.includes("stream") || t.includes("streaming") || t.includes("player") || t.includes("live")
              );
              const hasStreamText = descriptionLower.includes("stream") || 
                                     descriptionLower.includes("live") || 
                                     descriptionLower.includes("online") || 
                                     descriptionLower.includes("player");
              if (!isStreamDomain && !hasStreamTags && !hasStreamText) subFilterMatch = false;
            } else if (selectedSubFilter === "anime") {
              if (provider.category !== "anime") subFilterMatch = false;
            } else if (selectedSubFilter === "torrent") {
              if (provider.category !== "torrents") subFilterMatch = false;
            }
          }

          if (!subFilterMatch) continue;

          if (filterEmptyResults && queryStr.length >= 3) {
            const liveStatus = scraperStatuses[provider.domain];
            if (liveStatus && liveStatus.status === "no_results") {
              continue;
            }
          }

          filtered.push(provider);
        }

        // Sort database matching
        filtered.sort(function(a, b) {
          if (selectedSubFilter === "bengali") {
            const idxA = bengaliDomains.indexOf(a.domain.toLowerCase());
            const idxB = bengaliDomains.indexOf(b.domain.toLowerCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
          }

          if (selectedSubFilter === "4k_uhd") {
            const idxA = topQualityDomains.indexOf(a.domain.toLowerCase());
            const idxB = topQualityDomains.indexOf(b.domain.toLowerCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
          }

          if (isBengali) {
            const idxA = bengaliDomains.indexOf(a.domain.toLowerCase());
            const idxB = bengaliDomains.indexOf(b.domain.toLowerCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
          }

          const idxQA = topQualityDomains.indexOf(a.domain.toLowerCase());
          const idxQB = topQualityDomains.indexOf(b.domain.toLowerCase());
          if (idxQA !== -1 && idxQB !== -1) return idxQA - idxQB;
          if (idxQA !== -1) return -1;
          if (idxQB !== -1) return 1;

          const scoreA = (providerWeights[a.domain] || 0) * 10 + a.rating;
          const scoreB = (providerWeights[b.domain] || 0) * 10 + b.rating;
          return scoreB - scoreA;
        });

        sendResponse({ filtered });
      }
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);

    const useSharedWorker = typeof SharedWorker !== "undefined";
    let activeWorker: any = null;
    let workerPort: any = null;

    const handleWorkerResponse = (e: any) => {
      const filteredFromWorker = e.data.filtered as Array<{ domain: string }>;
      const resolved = filteredFromWorker
        .map((item) => SEARCH_PROVIDERS.find((p) => p.domain === item.domain))
        .filter((p): p is SearchProvider => p !== undefined);
      setFilteredProviders(resolved);
    };

    if (useSharedWorker) {
      try {
        const sw = new SharedWorker(workerUrl);
        activeWorker = sw;
        workerPort = sw.port;
        workerPort.onmessage = handleWorkerResponse;
        workerPort.start();
        console.log("SharedWorker initialized successfully");
      } catch (err) {
        console.warn(
          "SharedWorker initialization failed, falling back to dedicated Worker:",
          err,
        );
      }
    }

    if (!workerPort) {
      const dw = new Worker(workerUrl);
      activeWorker = dw;
      dw.onmessage = handleWorkerResponse;
      console.log("Dedicated Worker initialized successfully");
    }

    workerRef.current = { worker: activeWorker, port: workerPort };

    return () => {
      if (workerPort) {
        workerPort.close();
      } else if (activeWorker) {
        activeWorker.terminate();
      }
    };
  }, []);

  // Live Scraper Status Variables

  const [scraperStatuses, setScraperStatuses] = useState<
    Record<
      string,
      {
        status: "idle" | "checking" | "success" | "no_results" | "error";
        message?: string;
        responseTime?: number;
        scrapedItems?: { title: string; link: string; poster: string }[];
      }
    >
  >({});
  const [isCurrentlyScraping, setIsCurrentlyScraping] = useState(false);
  const [filterEmptyResults, setFilterEmptyResults] = useState(false);

  // User Click Interactive weights
  const [providerWeights, setProviderWeights] = useState<
    Record<string, number>
  >(() => {
    try {
      const saved = localStorage.getItem("provider_weights");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (!isSearchExecuted) return;
    if (workerRef.current) {
      const payload = {
        query,
        activeCategory,
        selectedSubFilter,
        providerWeights,
        filterEmptyResults,
        scraperStatuses,
        searchProviders: SEARCH_PROVIDERS.map((p) => ({
          name: p.name,
          domain: p.domain,
          description: p.description,
          category: p.category,
          rating: p.rating,
          tier: p.tier,
          tags: p.tags,
          url: p.url })),
        bengaliDomains: BENGALI_DOMAINS,
        topQualityDomains: TOP_QUALITY_DOMAINS,
        isBengali: isBengaliQuery(query),
        detectedFilterType };

      if (workerRef.current.port) {
        workerRef.current.port.postMessage(payload);
      } else if (workerRef.current.worker) {
        workerRef.current.worker.postMessage(payload);
      }
    }
  }, [
    query,
    activeCategory,
    selectedSubFilter,
    providerWeights,
    filterEmptyResults,
    scraperStatuses,
    detectedFilterType,
  ]);

  const triggerProviderClick = (domain: string) => {
    setProviderWeights((prev) => {
      const val = (prev[domain] || 0) + 1;
      const updated = { ...prev, [domain]: val };
      try {
        localStorage.setItem("provider_weights", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save provider weights to localStorage:", e);
      }
      return updated;
    });
  };

  // Recent Searches State
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("recent_searches");
      return saved
        ? JSON.parse(saved)
        : ["Batman", "Elden Ring", "Demon Slayer", "Inception"];
    } catch {
      return ["Batman", "Elden Ring", "Demon Slayer", "Inception"];
    }
  });

  const saveToRecent = (term: string) => {
    if (!term || term.trim().length < 2) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (x) => x.toLowerCase() !== cleanTerm.toLowerCase(),
      );
      const updated = [cleanTerm, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save recent search:", err);
      }
      return updated;
    });
  };

  const handleLinkClick = (
    e: React.MouseEvent,
    domain: string,
    url: string,
  ) => {
    triggerProviderClick(domain);
  };

  // Multi-modal States
  const [isEnhancingQuery, setIsEnhancingQuery] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Live scraping disabled
  useEffect(() => {
    setIsCurrentlyScraping(false);
  }, []);

  // Auto-detect and set appropriate category filter disabled for multi-rendering
  useEffect(() => {
    // We intentionally do not mutate activeCategory here so the UI can stay in "all"
    // and rely on `detectedFilterType` combined with `multiEntities` for parallel auto-rendering.
  }, [selectedEntity, isManualCategory]);

  useEffect(() => {
    // Auto category mapping disabled
  }, [query, selectedEntity]);

  // Auto-detect Bengali search pattern to select Bengali subfilter instantly
  useEffect(() => {
    if (isBengaliQuery(query)) {
      setSelectedSubFilter("bengali");
    } else if (query === "") {
      setSelectedSubFilter("all");
    }
  }, [query]);

  // Preload trending recommendations on page load
  useEffect(() => {
    TRENDING_RECOMMENDATIONS.forEach((item) => {
      preloadImage(item.poster_path);
      preloadImage(item.backdrop_path);
    });
  }, []);

  // Suggestions dropdown removed per requirement

  // Hide suggestions when clicking outside
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selectSuggestion = (item: SuggestionItem) => {
    setMultiEntities([item]);
    setHasSelectedPoster(true);
    setActiveGroupTab(null);
    setHasSelectedCategory(false);
    setActiveCategory("all");
    setQuery(item.title);
    saveToRecent(item.title);
    setShowSuggestions(false);
    setHidePoster(false);
    setIsSearchExecuted(true);
    setSelectedSubFilter("all");
    lastSearchedQuery.current = item.title;
  };

// No image upload logic

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    if (searchInputRef.current) searchInputRef.current.value = "";
    searchInputRef.current?.focus();
  };

  // Semantic query expansion via Gemini
  const enhanceQueryWithAI = async () => {
    if (!query || query.trim().length < 2) return;
    setIsEnhancingQuery(true);
    try {
      const res = await fetch("/api/search/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }) });
      if (res.ok) {
        const data = await res.json();
        if (data.enhancedQuery && data.enhancedQuery !== query) {
          setQuery(data.enhancedQuery);
        }
      }
    } catch (err) {
      console.error("Query synthesis error:", err);
    } finally {
      setIsEnhancingQuery(false);
    }
  };

  // Dynamic metrics of hidden empty providers
  const totalInCurrentCategory = React.useMemo(() => {
    return SEARCH_PROVIDERS.filter((provider) => {
      if (activeCategory === "all") return true;
      if (activeCategory === "streaming") {
        const dL = provider.domain.toLowerCase();
        const descL = provider.description.toLowerCase();
        const tagsL = provider.tags.map((t) => t.toLowerCase());
        const isStreamDom = [
          "cinefreak.nl",
          "cinedoze.tv",
          "cinemalux.skin",
          "new1.hdhub4u.cl",
          "hdhub4u.tv",
          "goplay.su",
          "kisskh.id",
          "asiaflix.net",
          "flixer.su",
          "moviebaaz.cfd",
        ].includes(dL);
        const hasStreamT = tagsL.some(
          (t) =>
            t.includes("stream") ||
            t.includes("streaming") ||
            t.includes("player") ||
            t.includes("live"),
        );
        const hasStreamText =
          descL.includes("stream") ||
          descL.includes("live") ||
          descL.includes("online") ||
          descL.includes("player");
        return isStreamDom || hasStreamT || hasStreamText;
      }
      return provider.category === activeCategory;
    }).length;
  }, [activeCategory]);
  const hiddenCount = totalInCurrentCategory - filteredProviders.length;

  const executeSmartSearch = () => {
    const qToSearch =
      localQueryRef.current.trim().length >= 1 ? localQueryRef.current : query;
    if (qToSearch.trim().length >= 1) {
      if (qToSearch !== query) {
        setQuery(qToSearch);
      }
      saveToRecent(qToSearch);
      setShowSuggestions(false);
      setHasSelectedPoster(false);
      setIsSearchExecuted(true);
      setHidePoster(false);
      setMultiEntities([]); // Instantly clear the posters
      setHasSelectedCategory(true);
      setSelectedSubFilter("all");
      lastSearchedQuery.current = qToSearch.trim();
      searchInputRef.current?.blur();

      const detectedCat = analyzeSearchQuery(qToSearch);

      setActiveGroupTab(detectedCat);
      fetchExactPoster(qToSearch, detectedCat);
    }
  };

  const searchBarNode = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.5 }}
      
      className={`w-full max-w-3xl lg:max-w-4xl px-2 sm:px-4 mx-auto relative ${isInputFocused ? "z-[110]" : "z-50"}`}
      onMouseEnter={() => setIsHoveringSearch(true)}
      onMouseLeave={() => setIsHoveringSearch(false)}
    >
      {/* Background glow (removed continuous breathing animation) */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-blue-500/40 blur-3xl transition-opacity duration-[950ms] ${isInputFocused ? "opacity-100 scale-[1.02]" : "opacity-60 scale-100"}`}
        
      />
      <div
        className={`relative w-full rounded-full transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isInputFocused 
            ? "scale-[1.02] ring-[1px] ring-white/40 bg-white/[0.02]" 
            : "ring-[1px] ring-white/20 hover:scale-[1.02] hover:ring-white/40 hover:bg-white/[0.03]"
        }`}
        
      >
        {/* Hardware accelerated shadows */}
        <div className={`absolute inset-0 rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6),inset_0_1px_4px_rgba(255,255,255,0.2)] opacity-100 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isInputFocused ? "opacity-0" : "hover:opacity-0"} pointer-events-none`}  />
        <div className={`absolute inset-0 rounded-full shadow-[0_25px_60px_-12px_rgba(99,102,241,0.3),inset_0_1px_5px_rgba(255,255,255,0.3)] opacity-0 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${!isInputFocused ? "hover:opacity-100" : ""} pointer-events-none`}  />
        <div className={`absolute inset-0 rounded-full shadow-[0_30px_80px_-15px_rgba(99,102,241,0.4),inset_0_1px_8px_rgba(255,255,255,0.4)] opacity-0 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isInputFocused ? "opacity-100" : ""} pointer-events-none`}  />

        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.05)] pointer-events-none" />
        <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-80" />
        <div className="absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (localQueryRef.current.trim().length >= 1) {
              executeSmartSearch();
            }
          }}
          className={`relative w-full flex items-center p-1.5 sm:p-2 z-10 rounded-full overflow-hidden transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
             isDark
               ? "bg-gradient-to-br from-white/[0.08] to-transparent backdrop-blur-[60px] focus-within:from-white/[0.12] focus-within:to-white/[0.03]"
               : "bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-[60px] focus-within:from-white/60 focus-within:to-white/20"
           }`}
        >
          <div className="pl-3 sm:pl-4 text-indigo-400/70 focus-within:text-indigo-400 transition-colors">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            defaultValue={query}
            onChange={(e) => {
              handleQueryChange(e.target.value);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setIsInputFocused(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBlur={() => {
              setTimeout(() => setIsInputFocused(false), 200);
            }}
            title="Enter query"
            placeholder="Search any movie, show, game, software..."
            className={`bg-transparent border-none focus:ring-0 text-sm sm:text-base w-full py-1.5 sm:py-2 px-3 sm:px-5 font-medium tracking-wide outline-none placeholder:font-normal placeholder:tracking-normal ${
              isDark
                ? "text-white placeholder:text-white/40"
                : "text-slate-900 placeholder:text-slate-400"
            }`}
          />

          {!isInputFocused && query.length === 0 && (
            <div
              className={`hidden lg:flex items-center gap-1.5 text-[9px] font-black px-2 py-1 rounded-lg tracking-widest mr-2 pointer-events-none select-none font-mono transition-colors border ${
                isDark
                  ? "text-white/40 bg-white/5 border-white/10"
                  : "text-indigo-600 bg-indigo-50 border-indigo-200"
              }`}
            >
              <span
                className={`px-1.5 py-0.5 rounded shadow-[0_1px_2px_rgba(0,0,0,0.2)] ${isDark ? "text-white/80 bg-white/10 border border-white/5" : "text-white bg-indigo-500"}`}
              >
                /
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 sm:gap-2 pr-1 sm:pr-1.5 shrink-0">
            {query.length > 0 && (
              <button
                onClick={clearSearch}
                type="button"
                className="p-1 sm:p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                title="Clear Search"
              >
                <X size={20} />
              </button>
            )}

            <button
              type="submit"
              className={`group ml-0.5 sm:ml-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-black text-[11px] sm:text-[14px] tracking-widest uppercase transition-all duration-[950ms] flex items-center justify-center shrink-0 border border-indigo-400/20 relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white active:scale-[0.98]`}
              
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] opacity-100 group-hover:opacity-0 transition-opacity duration-[950ms] pointer-events-none"  />
              <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] pointer-events-none"  />
              <span className="relative z-10">Search</span>
            </button>
          </div>
        </form>
      </div>

      <AnimatePresence></AnimatePresence>
    </motion.div>
  );

  // searchBarNode removed from top
  return (
    <>
      <div
        className={`relative min-h-screen pt-16 sm:pt-20 pb-12 px-2 sm:px-3 md:px-4 antialiased ${
          isDark ? "text-white" : "text-slate-800"
        }`}
      >
        <div
          className={`fixed inset-0 pointer-events-none overflow-hidden select-none -z-50 ${isDark ? "bg-transparent" : "bg-[#f8fafc]"}`}
        />
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-40">
          {/* Grid lines removed as requested */}
        </div>

        {/* Selected entity aesthetic background glow (glassmorphic ambient bleed) */}
        <AnimatePresence>
          {(selectedEntity ||
            (hasSelectedPoster && multiEntities.length > 0)) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              className={`fixed inset-0 pointer-events-none overflow-hidden -z-20`}
            >
              <img
                src={
                  selectedEntity?.poster_path ||
                  selectedEntity?.poster ||
                  selectedEntity?.backdrop_path ||
                  (multiEntities.length > 0
                    ? multiEntities[focusedPosterIndex >= 0 ? focusedPosterIndex : 0]?.poster_path ||
                      multiEntities[focusedPosterIndex >= 0 ? focusedPosterIndex : 0]?.poster ||
                      multiEntities[focusedPosterIndex >= 0 ? focusedPosterIndex : 0]?.backdrop_path
                    : "") ||
                  getThematicPlaceholder(
                    selectedEntity?.title || multiEntities[0]?.title || "",
                    selectedEntity?.type || multiEntities[0]?.type,
                  )
                }
                alt=""
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  hasSelectedPoster
                    ? "opacity-60 blur-[80px] scale-[1.15] saturate-[1.8]"
                    : "opacity-[0.25] blur-[40px] scale-[1.02] saturate-[1.5]"
                }`}
              />
              {/* Perfect Glassmorphism Overlay */}
              {hasSelectedPoster && (
                <div
                  className={`absolute inset-0 ${isDark ? "bg-[#06080d]/60 backdrop-blur-3xl" : "bg-white/60 backdrop-blur-3xl"} saturate-[1.5] border-b border-white/5`}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`w-full relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] mt-0`}
        >
          {/* Static Hero Section */}
          <div
            className={`flex flex-col items-center w-full transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${hasSelectedPoster || isSearchExecuted || hasSelectedCategory ? "opacity-0 max-h-0 scale-95 pointer-events-none mb-0" : "opacity-100 max-h-[1000px] scale-100 mb-6"}`}
          >
            {/* Page Badge */}
            <div
              className={`mb-4 mt-2 flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border backdrop-blur-xl text-center select-none shadow-[0_0_20px_rgba(99,102,241,0.15)] ${
                isDark
                  ? "bg-indigo-500/[0.06] border-indigo-500/20"
                  : "bg-indigo-50/50 border-indigo-100"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <span
                className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${
                  isDark ? "text-indigo-400" : "text-indigo-600"
                }`}
              >
                WELCOME
              </span>
            </div>

            {/* Heading */}
            <h1
              className={`text-5xl sm:text-7xl md:text-[80px] lg:text-[90px] font-black text-center tracking-tighter leading-[0.95] mb-2 font-display uppercase px-2 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              THE WEB
              <br />
              <span className="text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-indigo-500 to-purple-600">
                UNIVERSE
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.2 }}
              
              className={`max-w-4xl w-full text-center text-xs sm:text-sm md:text-base font-medium mb-4 sm:mb-6 px-4 leading-relaxed tracking-wide ${
                isDark ? "text-white/60" : "text-slate-600"
              }`}
            >
              Experience an <span className={`${isDark ? "text-white/85" : "text-slate-800"} font-black transition-colors duration-[950ms]`}>elite universe</span> of the world&apos;s most premium resources. Explore a curated index of verified Premium cross-platform 4K Movies & Shows, Games, Softwares, Torrents, Anime, Tech Utilities—all the web&apos;s most valuable resources in one beautiful slot.
            </motion.p>
          </div>

          {/* HeaderSection wrapper around search interface and filter buttons */}
          <div className="sticky top-14 md:top-16 z-[100] w-full pt-2 sm:pt-3 pb-3 px-2 pointer-events-auto bg-transparent border-b border-transparent mb-0">
            {searchBarNode}
            <AnimatePresence mode="wait">
              {query.trim().length > 0 &&
                !hidePoster &&
                isSearchExecuted &&
                !hasSelectedPoster &&
                staticGroups.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                    
                    className="relative w-full max-w-full overflow-x-auto no-scrollbar flex items-center justify-start sm:justify-center gap-2 sm:gap-3 flex-nowrap pb-2 pt-2 sm:pt-3 px-1 pointer-events-auto"
                  >
                    {staticGroups.map((g) => {
                      const isActive =
                        hasSelectedCategory && activeGroupTab === g.id;
                      return (
                        <motion.button
                          layout
                          key={g.id}
                          onClick={() => {
                            if (isActive) return;
                            React.startTransition(() => {
                              setActiveGroupTab(g.id);
                              setHasSelectedCategory(true);
                              fetchExactPoster(query, g.id);
                            });
                          }}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 md:px-6 py-1.5 sm:py-2.5 rounded-full font-bold text-[11px] sm:text-[13px] md:text-sm tracking-wide transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] border backdrop-blur-3xl shadow-lg whitespace-nowrap shrink-0 hover:scale-[1.02] active:scale-[0.98] group pointer-events-auto focus:outline-none ${
                            isActive
                              ? isDark
                                ? "bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5),inset_0_1px_5px_rgba(255,255,255,0.4)] ring-1 ring-indigo-400"
                                : "bg-indigo-500 text-white border-indigo-600/50 shadow-lg"
                              : isDark
                                ? "bg-white/[0.04] text-white/70 border-white/20 hover:text-white/95 hover:bg-white/[0.08] hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_1px_3px_rgba(255,255,255,0.2)]"
                                : "bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`transition-colors duration-[950ms] ${isActive ? "text-white" : isDark ? "text-indigo-400 group-hover:text-indigo-300" : "text-indigo-500 group-hover:text-indigo-600"}`}
                          >
                            {g.icon}
                          </div>
                          {g.tag}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Search suggestions panel placeholder removed for maximum compact visual layout */}
          {/* Main Category Tabs removed to focus purely on filters as requested */}
          {/* ==================== GOOGLE-STYLE VISUAL KNOWLEDGE GRAPH & POSTER SUITE ==================== */}
          <motion.div
            initial={false}
            animate={
              query.trim().length > 0 && !hidePoster && isSearchExecuted
                ? { opacity: 1, y: 0, scale: 1, display: "block" }
                : {
                    opacity: 0,
                    y: 40,
                    scale: 0.95,
                    transitionEnd: { display: "none" } }
            }
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
            className="w-full mt-2 sm:mt-4 mb-4 z-40"
          >
            <div className="w-full">
              {/* Left Big Spotlight Pane (Now Full Width and supports Multi-Assets) */}
              {staticGroups.length > 0 && currentGroup && (
                <div className="w-full flex flex-col gap-2 mt-2 sm:mt-4">
                  <div className="w-full flex gap-4 flex-col">
                    {hasSelectedCategory && !hasSelectedPoster && (
                      <>
                        <motion.div
                          key={`group-grid-${currentGroup.id}`}
                          variants={{
                            hidden: { opacity: 0 },
                            visible: {
                              opacity: 1,
                              transition: { staggerChildren: 0.05 } } }}
                          initial="hidden"
                          animate="visible"
                          className="w-full grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 px-1 sm:px-2 relative isolate"
                          style={{
                            gridAutoRows: "minmax(min-content, max-content)" }}
                        >
                          {isFetchingPoster && multiEntities.length === 0 ? (
                            <SmartSkeleton
                              count={14}
                              type={activeGroupTab || "movie"}
                            />
                          ) : (
                            <>
                              {multiEntities
                                .slice(0, visibleEntitiesCount)
                                .map((entity, idx) => {
                                  // Centralized Stagger calculation
                                  const center =
                                    Math.min(
                                      visibleEntitiesCount,
                                      multiEntities.length,
                                    ) / 2;
                                  const distance = Math.abs(idx - center);

                                  return (
                                    <motion.div
                                      initial={{ opacity: 0, y: 30 }}
                                      whileInView={{ opacity: 1, y: 0 }}
                                      viewport={{ once: true, margin: "-50px" }}
                                      whileTap={{ scale: 0.98 , transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 }}}
                                      transition={{
                                        type: "spring",
                                        stiffness: 110, damping: 20, mass: 1,
                                        delay: distance * 0.03 }}
                                      
                                      key={`grid-item-${entity.id}-${idx}`}
                                      onClick={() => {
                                        const catId =
                                          entity.type === "movie"
                                            ? "movies"
                                            : entity.type === "software"
                                              ? "software"
                                              : entity.type === "anime"
                                                ? "anime"
                                                : "games";
                                        setActiveCategory("all");
                                        setIsManualCategory(true);
                                        setMultiEntities([entity]);
                                        setHasSelectedPoster(true);
                                        setSelectedSubFilter("all");
                                        searchInputRef.current?.blur();
                                      }}
                                      onMouseEnter={() => setFocusedPosterIndex(idx)}
                                      onMouseLeave={() => setFocusedPosterIndex(-1)}
                                      className={`w-full flex flex-col gap-2 relative group cursor-pointer transition-[opacity,filter] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-20 ${focusedPosterIndex === idx ? "!opacity-100 !blur-0 z-30" : ""}`}
                                    >
                                      <motion.div
whileHover={{ scale: 1.03, y: -6, zIndex: 50, transition: { type: "spring", stiffness: 150, damping: 22, mass: 0.8 } }}
whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
className={`poster-wrapper w-full relative overflow-hidden rounded-[16px] xl:rounded-[20px] transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 ${
                                          entity.type === "software" ||
                                          entity.type === "system" ||
                                          entity.type === "tool"
                                            ? "h-48 sm:h-56 md:h-64 flex items-center justify-center bg-white/[0.03]"
                                            : "aspect-[2/3] bg-white/[0.03]"
                                        } origin-center transform-gpu group-hover:bg-slate-900 z-10 ${focusedPosterIndex === idx ? "bg-slate-900 z-20" : ""}`}
                                      >
                                        <div className={`absolute inset-0 rounded-[16px] xl:rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_50px_rgba(255,255,255,0.15)] border-white/30 border opacity-0 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 pointer-events-none group-hover:opacity-100 ${focusedPosterIndex === idx ? "opacity-100" : ""}`}  />
                                        <SafeImage
                                          src={entity.poster_path}
                                          alt={entity.title}
                                          title={entity.title}
                                          type={entity.type}
                                          priority={idx < 14}
                                          fallbackIcon={
                                            entity.type === "movie" ? (
                                              <Clapperboard size={24} />
                                            ) : entity.type === "game" ? (
                                              <Gamepad2 size={24} />
                                            ) : entity.type === "software" ||
                                              entity.type === "system" ? (
                                              <HardDrive size={24} />
                                            ) : (
                                              <Tv size={24} />
                                            )
                                          }
                                          className="poster-image w-full h-full object-cover transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-center"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

                                        {/* Type Icon Overlay */}
                                        <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 shadow-lg z-20">
                                          {entity.type === "movie" ? (
                                            <Clapperboard size={14} />
                                          ) : entity.type === "game" ? (
                                            <Gamepad2 size={14} />
                                          ) : entity.type === "software" ||
                                            entity.type === "system" ? (
                                            <HardDrive size={14} />
                                          ) : (
                                            <Tv size={14} />
                                          )}
                                        </div>
                                      </motion.div>


                                      {/* Bottom Info Layout: Clear, Compact, and Unobtrusive below the poster */}
                                      <div className="flex flex-col justify-start items-center text-center px-1">
                                        <h3 className="text-white/95 font-bold text-[11px] sm:text-[13px] leading-tight font-sans tracking-wide drop-shadow-sm transition-colors duration-[950ms] w-full overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-white">
                                          {entity.title}
                                        </h3>

                                        <div className="flex items-center justify-center gap-1.5 mt-[2px] opacity-70 group-hover:opacity-100 transition-opacity">
                                          {entity.release_date &&
                                            entity.release_date !==
                                              "Unknown" && (
                                              <span className="font-mono text-[9px] sm:text-[10px] text-white/70 tracking-widest font-bold">
                                                {entity.release_date.substring(
                                                  0,
                                                  4,
                                                )}
                                              </span>
                                            )}
                                          {entity.release_date &&
                                            entity.release_date !==
                                              "Unknown" && (
                                              <span className="text-white/30 text-[8px]">
                                                •
                                              </span>
                                            )}
                                          <span
                                            className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-wider ${
                                              entity.type === "movie"
                                                ? "text-amber-400"
                                                : entity.type === "game"
                                                  ? "text-emerald-400"
                                                  : entity.type === "software"
                                                    ? "text-cyan-400"
                                                    : entity.type === "system"
                                                      ? "text-rose-400"
                                                      : "text-fuchsia-400"
                                            }`}
                                          >
                                            {entity.type === "movie"
                                              ? "Movie/TV"
                                              : entity.type === "game"
                                                ? "Video Games"
                                                : entity.type === "software"
                                                  ? "Software"
                                                  : entity.type === "system"
                                                    ? "System"
                                                    : "Anime"}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                            </>
                          )}
                        </motion.div>

                        {/* Load More Pagination */}
                        {multiEntities.length > visibleEntitiesCount &&
                          !isFetchingPoster && (
                            <div className="w-full flex justify-center py-6 mt-4">
                              <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                whileHover={{ scale: 1.03, y: -6, zIndex: 50, transition: { type: "spring", stiffness: 150, damping: 22, mass: 0.8 } }}
                                whileTap={{ scale: 0.98 , transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 }}}
                                className="px-8 py-3 rounded-full font-black tracking-widest uppercase text-sm border bg-white/5 border-white/10 hover:bg-white/10 active:bg-white/5 text-white/90 shadow-lg backdrop-blur-md"
                                onClick={() =>
                                  setVisibleEntitiesCount((prev) => prev + 12)
                                }
                              >
                                Load More Results
                              </motion.button>
                            </div>
                          )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {isSearchExecuted &&
                multiEntities.length === 0 &&
                query.trim().length > 0 &&
                !hasSelectedPoster &&
                !isFetchingPoster && (
                  <div className="w-full py-20 flex flex-col items-center justify-center animate-in fade-in duration-[950ms]"></div>
                )}
            </div>
          </motion.div>
          {/* Ranked Websites Results List shown on Poster Selection */}
          {hasSelectedPoster && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              className="w-full flex flex-col items-start mt-6 sm:mt-8"
            >
              {/* Premium Side-by-Side Poster Hero */}
              {multiEntities[0] && (
                <motion.div
                  key={multiEntities[0].id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                  className="flex flex-col md:flex-row items-stretch gap-6 w-full mb-8 sm:mb-12 pt-2"
                >
                  <div className="w-[140px] sm:w-[200px] md:w-[240px] lg:w-[280px] shrink-0 mx-auto md:mx-0">
                    <div 
                      className="aspect-[2/3] w-full relative rounded-[16px] md:rounded-[24px] overflow-hidden shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group cursor-default"
                      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                    >
                      <SafeImage
                        src={
                          multiEntities[0].poster_path ||
                          multiEntities[0].poster
                        }
                        alt={multiEntities[0].title}
                        title={multiEntities[0].title}
                        type={multiEntities[0].type}
                        fallbackIcon={
                          multiEntities[0].type === "movie" ? (
                            <Clapperboard size={32} />
                          ) : multiEntities[0].type === "game" ? (
                            <Gamepad2 size={32} />
                          ) : multiEntities[0].type === "software" ||
                            multiEntities[0].type === "system" ||
                            multiEntities[0].type === "tool" ? (
                            <HardDrive size={32} />
                          ) : (
                            <Tv size={32} />
                          )
                        }
                        className="w-full h-full object-cover transition-transform duration-[950ms] group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
                      <div className="absolute top-3 right-3 p-2 sm:p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 shadow-lg z-20">
                        {multiEntities[0].type === "movie" ? (
                          <Clapperboard size={18} />
                        ) : multiEntities[0].type === "game" ? (
                          <Gamepad2 size={18} />
                        ) : multiEntities[0].type === "software" ||
                          multiEntities[0].type === "system" ||
                          multiEntities[0].type === "tool" ? (
                          <HardDrive size={18} />
                        ) : (
                          <Tv size={18} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center py-2 text-center md:text-left flex-1 items-center md:items-start">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tight drop-shadow-2xl mb-3 md:mb-4 flex flex-col md:flex-row flex-wrap items-center md:items-center gap-2 sm:gap-3">
                      {multiEntities[0].title}
                      <span className="text-[9px] sm:text-xs px-2 sm:px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full font-bold uppercase tracking-widest shadow-lg border border-amber-500/20 whitespace-nowrap mt-1 md:mt-0">
                        {multiEntities[0].type === "movie"
                          ? "Movies & Shows"
                          : multiEntities[0].type === "game"
                            ? "Video Games"
                            : multiEntities[0].type === "software" ||
                                multiEntities[0].type === "tool" ||
                                multiEntities[0].type === "system"
                              ? "Software & Tools"
                              : "Anime"}
                      </span>
                    </h1>
                    {multiEntities[0].release_date &&
                      multiEntities[0].release_date !== "Unknown" && (
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                          <span className="text-white/60 font-medium text-xs md:text-sm bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05] shadow-inner backdrop-blur-md">
                            Released:{" "}
                            <strong className="text-white/90 pl-1">
                              {multiEntities[0].release_date.substring(0, 4)}
                            </strong>
                          </span>
                        </div>
                      )}
                    <p className="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl pt-2 drop-shadow-md">
                      {multiEntities[0].overview || "No overview available."}
                    </p>
                  </div>
                </motion.div>
              )}

              {(() => {
                const allRes = getAllResources();
                return activeFiltersList.map((filter) => {
                  const FilterIcon = filter.icon;
                  const isActive = selectedSubFilter === filter.id;

                  // Dynamically group criteria mapping output
                  const sectionProviders = filteredProviders.filter(
                  (provider) => {
                    const dL = provider.domain.toLowerCase();
                    const descL = (provider.description || "").toLowerCase();
                    const tagsL = (provider.tags || []).map((t) =>
                      t.toLowerCase(),
                    );

                    if (detectedFilterType === "games") {
                      if (provider.category !== "games") return false;
                      if (filter.id === "pc_games") {
                        const isPC = [
                          "fitgirl-repacks.site",
                          "dodi-repacks.download",
                          "ovagames.com",
                          "steamrip.com",
                          "gogunlocked.com",
                          "steamunlocked.org",
                          "repack-games.com",
                          "steamgg.net",
                          "ankergames.net",
                          "playzip.com",
                          "igg-games.com",
                        ].includes(dL);
                        const hasPCTags = tagsL.some(
                          (t) =>
                            t.includes("pc") ||
                            t.includes("steam") ||
                            t.includes("repack") ||
                            t.includes("install") ||
                            t.includes("windows") ||
                            t.includes("iso"),
                        );
                        const hasPCText =
                          descL.includes("pc") ||
                          descL.includes("steam") ||
                          descL.includes("windows") ||
                          descL.includes("installation");
                        return isPC || hasPCTags || hasPCText;
                      }
                      if (filter.id === "android_games") {
                        const isAndroid = [
                          "liteapks.com",
                          "modyolo.com",
                          "an1.com",
                          "5play.org",
                          "getmodsapk.com",
                          "apkpure.com",
                          "apkmirror.com",
                        ].includes(dL);
                        const hasAndroidTags = tagsL.some(
                          (t) =>
                            t.includes("android") ||
                            t.includes("apk") ||
                            t.includes("mobile") ||
                            t.includes("phone"),
                        );
                        const hasAndroidText =
                          descL.includes("android") ||
                          descL.includes("apk") ||
                          descL.includes("mobile") ||
                          descL.includes("phone");
                        return isAndroid || hasAndroidTags || hasAndroidText;
                      }
                      if (filter.id === "playstation") {
                        const hasPsTags = tagsL.some(
                          (t) =>
                            t.includes("playstation") ||
                            t.includes("ps2") ||
                            t.includes("ps3") ||
                            t.includes("iso"),
                        );
                        return hasPsTags || descL.includes("playstation");
                      }
                      if (filter.id === "xbox") {
                        const hasXboxTags = tagsL.some(
                          (t) =>
                            t.includes("xbox") ||
                            t.includes("iso") ||
                            t.includes("360") ||
                            t.includes("rom"),
                        );
                        const hasXboxText =
                          descL.includes("xbox") ||
                          descL.includes("iso") ||
                          descL.includes("360") ||
                          descL.includes("rom");
                        return hasXboxTags || hasXboxText;
                      }
                      if (filter.id === "nintendo") {
                        const hasNintTags = tagsL.some(
                          (t) =>
                            t.includes("nintendo") ||
                            t.includes("switch") ||
                            t.includes("3ds") ||
                            t.includes("emulator") ||
                            t.includes("rom"),
                        );
                        const hasNintText =
                          descL.includes("nintendo") ||
                          descL.includes("switch") ||
                          descL.includes("3ds") ||
                          descL.includes("emulator") ||
                          descL.includes("rom");
                        return hasNintTags || hasNintText;
                      }
                      return true;
                    }

                    if (detectedFilterType === "software") {
                      if (provider.category !== "software") return false;
                      if (filter.id === "pc_software") {
                        const isPC = [
                          "filecr.com",
                          "getintopc.com",
                          "taiwebs.com",
                          "crackingcity.com",
                          "softpedia.com",
                          "filehorse.com",
                          "filehippo.com",
                        ].includes(dL);
                        const hasPCTags = tagsL.some(
                          (t) =>
                            t.includes("pc") ||
                            t.includes("windows") ||
                            t.includes("desktop") ||
                            t.includes("creative") ||
                            t.includes("utility") ||
                            t.includes("setup") ||
                            t.includes("installer"),
                        );
                        const hasPCText =
                          descL.includes("pc") ||
                          descL.includes("windows") ||
                          descL.includes("desktop") ||
                          descL.includes("creative") ||
                          descL.includes("utility") ||
                          descL.includes("setup") ||
                          descL.includes("installer");
                        return isPC || hasPCTags || hasPCText;
                      }
                      if (filter.id === "android_apk") {
                        const isAndroid = [
                          "apkmirror.com",
                          "apkpure.com",
                          "liteapks.com",
                          "modyolo.com",
                          "an1.com",
                          "5play.org",
                          "getmodsapk.com",
                        ].includes(dL);
                        const hasAndroidTags = tagsL.some(
                          (t) =>
                            t.includes("apk") ||
                            t.includes("android") ||
                            t.includes("mobile") ||
                            t.includes("mod"),
                        );
                        const hasAndroidText =
                          descL.includes("apk") ||
                          descL.includes("android") ||
                          descL.includes("mobile") ||
                          descL.includes("mod");
                        return isAndroid || hasAndroidTags || hasAndroidText;
                      }
                      if (filter.id === "operating_system") {
                        const isOS = [
                          "filecr.com",
                          "getintopc.com",
                          "taiwebs.com",
                        ].includes(dL);
                        const hasOSTags = tagsL.some(
                          (t) =>
                            t.includes("os") ||
                            t.includes("operating") ||
                            t.includes("windows 11") ||
                            t.includes("windows 10") ||
                            t.includes("macos") ||
                            t.includes("ubuntu") ||
                            t.includes("linux") ||
                            t.includes("iso"),
                        );
                        const hasOSText =
                          descL.includes("os") ||
                          descL.includes("operating system") ||
                          descL.includes("windows 11") ||
                          descL.includes("windows 10") ||
                          descL.includes("macos") ||
                          descL.includes("ubuntu") ||
                          descL.includes("linux") ||
                          descL.includes("iso");
                        return isOS || hasOSTags || hasOSText;
                      }
                      return true;
                    }

                    // Movies
                    if (filter.id === "all") return true;
                    if (filter.id === "bengali") {
                      return BENGALI_DOMAINS.includes(dL);
                    }
                    if (filter.id === "indian_dubbed") {
                      return INDIAN_DUBBED_DOMAINS.includes(dL);
                    }
                    if (filter.id === "4k_uhd") {
                      const is4KDom = TOP_QUALITY_DOMAINS.includes(dL);
                      const has4KT = tagsL.some(
                        (t) =>
                          t.includes("4k") ||
                          t.includes("uhd") ||
                          t.includes("dolby") ||
                          t.includes("hdr") ||
                          t.includes("atmos") ||
                          t.includes("10-bit") ||
                          t.includes("crisp"),
                      );
                      const has4KText =
                        descL.includes("4k") ||
                        descL.includes("uhd") ||
                        descL.includes("ultra-high") ||
                        descL.includes("atmos") ||
                        descL.includes("hevc 10-bit");
                      return is4KDom || has4KT || has4KText;
                    }
                    if (filter.id === "anime") {
                      return provider.category === "anime";
                    }
                    if (filter.id === "torrent") {
                      return provider.category === "torrents";
                    }
                    return true;
                  },
                );

                if (filter.id === "all") return null;

                if (filter.id === "bengali") {
                  sectionProviders.sort((a, b) => {
                    const idxA = BENGALI_DOMAINS.indexOf(a.domain.toLowerCase());
                    const idxB = BENGALI_DOMAINS.indexOf(b.domain.toLowerCase());
                    return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
                  });
                }
                
                if (filter.id === "indian_dubbed") {
                  sectionProviders.sort((a, b) => {
                    const idxA = INDIAN_DUBBED_DOMAINS.indexOf(a.domain.toLowerCase());
                    const idxB = INDIAN_DUBBED_DOMAINS.indexOf(b.domain.toLowerCase());
                    return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
                  });
                }
                
                if (filter.id === "4k_uhd") {
                  sectionProviders.sort((a, b) => {
                    const idxA = TOP_QUALITY_DOMAINS.indexOf(a.domain.toLowerCase());
                    const idxB = TOP_QUALITY_DOMAINS.indexOf(b.domain.toLowerCase());
                    return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
                  });
                }

                if (sectionProviders.length === 0) return null;

                return (
                  <div
                    key={filter.id}
                    className="w-full flex flex-col gap-4 mt-6 first:mt-0"
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <FilterIcon size={16} className="text-indigo-400" />
                      <span className="font-extrabold uppercase tracking-widest text-[#9ca3af] drop-shadow-sm text-[11px] sm:text-xs">
                        {filter.label}
                      </span>
                    </div>
                    <div
                      className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full mt-2 relative isolate"
                      style={{
                        gridAutoRows: "minmax(min-content, max-content)" }}
                    >
                      {sectionProviders.map((site, index) => {
                        const directSearchUrl = finalSearchQuery
                          ? site.getSearchUrl(finalSearchQuery)
                          : site.url;
                        
                        const siteDomainClean = site.domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
                        const matchingRes = allRes.find(r => {
                          const rDomainClean = r.domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
                          return rDomainClean === siteDomainClean || siteDomainClean.includes(rDomainClean);
                        });

                        const sitePortal = {
                          name: site.name,
                          domain: site.domain,
                          description: site.description,
                          url: directSearchUrl,
                          tags: site.tags,
                          type: site.category,
                          logo: matchingRes?.logo };
                        return (
                          <VirtualGridItem
                            key={`${site.name}-${site.domain}-${index}`}
                          >
                            <div
                              onClickCapture={(e) =>
                                handleLinkClick(
                                  e as any,
                                  site.domain,
                                  directSearchUrl,
                                )
                              }
                            >
                              <PortalCard
                                portal={sitePortal}
                                categoryId={site.category || "misc"}
                                index={index}
                                priority={index < 6}
                              />
                            </div>
                          </VirtualGridItem>
                        );
                      })}
                    </div>
                  </div>
                );
              }); })()}
            </motion.div>
          )}
          {/* Universal Footer Details / Categories */}
        </div>

        {/* Quick Directories (Dashboard View) and Developer appear below only on the landing state */}
        {query.trim().length === 0 && !selectedEntity && (
          <div className="w-full mt-2 sm:mt-4">
            <Suspense fallback={<div className="h-[200px] w-full" />}>
              <Dashboard />
              <Developer />
            </Suspense>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}
