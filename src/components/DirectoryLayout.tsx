import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Star,
  Clapperboard,
  MonitorPlay,
  Library,
  Code2,
  Magnet,
  ArrowLeft,
  ExternalLink,
  Search,
  Layers,
  Package,
  Zap,
  ShieldCheck,
  Sparkles,
  Keyboard,
  MonitorSpeaker,
  Gamepad2,
  Loader2,
  Copy,
  Check,
  Flag,
  Clock } from "lucide-react";
import { Link } from "react-router-dom";
import React, {
  useState,
  useRef,
  useMemo,
  memo,
  useEffect,
  useTransition,
  useCallback } from "react";
import { cn } from "@/src/lib/utils";
import { getCachedImage, saveImageToCache, inlineMemoryCache } from "@/src/lib/indexedDbCache";
import { getLogoForPortal } from "@/src/utils/logoMapper";
import { SEARCH_PROVIDERS } from "@/src/data/searchResources";
import toast from "react-hot-toast";

export interface Portal {
  name: string;
  domain: string;
  description: string;
  url: string;
  tags: string[];
  type?: string;
  logo?: string;
  release_date?: string;
}

const ICON_MAP: Record<string, any> = {
  movies: Clapperboard,
  streaming: MonitorPlay,
  games: Gamepad2,
  books: Library,
  typing: Keyboard,
  tech: Zap,
  software_apks: Package,
  software: Code2,
  security: ShieldCheck,
  anime: Sparkles,
  torrents: Magnet };

// Module-level caches to guarantee instant load times across user paths and prevent redundant network checks
const verifiedLogoCache = new Map<string, string>();
const failedLogoCache = new Set<string>();

export const getSmartFitStyles = (
  type: "logo" | "poster" = "logo",
): React.CSSProperties => ({
  objectFit: type === "poster" ? "cover" : "contain",
  objectPosition: "50% 50%" });

export const PortalLogo = memo(function PortalLogo({
  domain,
  name,
  categoryId,
  customLogo,
  priority = false }: {
  domain: string;
  name: string;
  categoryId: string;
  customLogo?: string;
  priority?: boolean;
}) {
  // Use high-speed, secure, edge-backed global CDN endpoints with Clearbit as priority for HD logos
  const sources = useMemo(() => {
    const list: string[] = [];

    // 1. HIGHEST PRIORITY: Strict exact mapping from our utility (local HD logos)
    const localLogoUrl = getLogoForPortal(domain, name);
    // Explicitly do not let 'customLogo' win if a mapped local file exists
    if (
      localLogoUrl &&
      localLogoUrl !== "" &&
      !failedLogoCache.has(localLogoUrl)
    ) {
      list.push(localLogoUrl + "?v=5");
    }

    // 2. Data-provided custom logo (often Google favicon or remote URL)
    if (
      customLogo &&
      customLogo !== localLogoUrl &&
      !failedLogoCache.has(customLogo)
    ) {
      list.push(customLogo.startsWith("/logos/") ? customLogo + "?v=5" : customLogo);
    }

    const clearbit = `https://logo.clearbit.com/${domain}?size=300`;
    const gstatic = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
    const googleS2 = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const duckduckgo = `https://icons.duckduckgo.com/ip3/${domain}.ico`;

    if (!failedLogoCache.has(clearbit)) list.push(clearbit);
    if (!failedLogoCache.has(gstatic)) list.push(gstatic);
    if (!failedLogoCache.has(googleS2)) list.push(googleS2);
    if (!failedLogoCache.has(duckduckgo)) list.push(duckduckgo);
    return list;
  }, [domain, customLogo, name]);

  // Determine starting source index. If this domain is already parsed and verified in the session, load it directly (-1) for zero latency!
  const [loadStep, setLoadStep] = useState(() => {
    const local = getLogoForPortal(domain, name);
    // Force reset cache if we mapped a local file, to ensure it bypasses localStorage
    if ((customLogo && customLogo.startsWith("/logos/")) || (local && local.startsWith("/logos/"))) {
        return 0;
    }
    const cachedUrl = verifiedLogoCache.get(domain);
    return cachedUrl ? -1 : 0;
  });

  const [persistedDataUrl, setPersistedDataUrl] = useState<string | null>(
    () => {
      const local = getLogoForPortal(domain, name);
      if ((customLogo && customLogo.startsWith("/logos/")) || (local && local.startsWith("/logos/"))) return null;
      const lastWorkingUrl =
        verifiedLogoCache.get(domain) ||
        (typeof window !== "undefined"
          ? localStorage.getItem(`logo-url:${domain}`)
          : null);
      if (lastWorkingUrl) {
        return inlineMemoryCache.get(lastWorkingUrl) || null;
      }
      return null;
    },
  );
  const [isLoaded, setIsLoaded] = useState(() => {
    const local = getLogoForPortal(domain, name);
    if ((customLogo && customLogo.startsWith("/logos/")) || (local && local.startsWith("/logos/"))) return false;
    const lastWorkingUrl =
      verifiedLogoCache.get(domain) ||
      (typeof window !== "undefined"
        ? localStorage.getItem(`logo-url:${domain}`)
        : null);
    if (lastWorkingUrl) {
      return inlineMemoryCache.has(lastWorkingUrl);
    }
    return false;
  });

  const inViewRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(inViewRef, { once: true, margin: "150px" });
  const shouldLoad = true;

  // Check IndexedDB persistent cache on load
  useEffect(() => {
    if (!shouldLoad) return;
    let isCancelled = false;
    async function loadLogoFromCache() {
      try {
        const local = getLogoForPortal(domain, name);
        if ((customLogo && customLogo.startsWith("/logos/")) || (local && local.startsWith("/logos/"))) return;
        
        const lastWorkingUrl =
          verifiedLogoCache.get(domain) ||
          localStorage.getItem(`logo-url:${domain}`);
        if (!lastWorkingUrl) return;

        // Skip async lookups if already matched in synchronous memory
        if (inlineMemoryCache.has(lastWorkingUrl)) {
          setPersistedDataUrl(inlineMemoryCache.get(lastWorkingUrl)!);
          setIsLoaded(true);
          return;
        }

        const cachedBase64 = await getCachedImage(lastWorkingUrl);
        if (isCancelled) return;

        if (cachedBase64) {
          setPersistedDataUrl(cachedBase64);
          setIsLoaded(true);
        }
      } catch (err) {
        // Fallback to normal loading if IndexedDB fails or is blocked
      }
    }

    loadLogoFromCache();

    return () => {
      isCancelled = true;
    };
  }, [domain]);

  const initials = useMemo(() => {
    return name
      .split(/[\s-_]+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  // Make an elegant, premium, animated monogram as the alternate logo fallback
  const Placeholder = useMemo(() => {
    // Premium dynamic mesh gradient fallback
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-2xl group/placeholder"
      >
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a103c] via-[#09090b] to-[#1e102f] z-0" />
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.25)_0%,transparent_50%)] animate-[spin_10s_linear_infinite]" />
        <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] opacity-30 mix-blend-screen bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25)_0%,transparent_50%)] animate-[spin_15s_linear_infinite_reverse]" />

        {/* Inner glow & border */}
        <div className="absolute inset-0 shadow-inner border border-white/5 rounded-2xl z-10" />

        {/* Text */}
        <div className="relative z-20 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black font-sans tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 drop-shadow-sm uppercase select-none transition-transform duration-[950ms]">
            {initials ? initials[0] : "?"}
          </span>
        </div>
      </motion.div>
    );
  }, [initials]);

  const handleLoad = () => {
    setIsLoaded(true);
    // If loaded from network and not dynamic IndexedDB Base64 data, store the working URL
    if (!persistedDataUrl && loadStep >= 0 && loadStep < sources.length) {
      const workingUrl = sources[loadStep];
      verifiedLogoCache.set(domain, workingUrl);
      try {
        localStorage.setItem(`logo-url:${domain}`, workingUrl);
      } catch (e) {}
      saveImageToCache(workingUrl).catch(() => {});
    }
  };

  const handleError = () => {
    setIsLoaded(false);
    if (persistedDataUrl) {
      setPersistedDataUrl(null);
      setLoadStep(0);
    } else if (loadStep >= 0 && loadStep < sources.length) {
      failedLogoCache.add(sources[loadStep]);
      setLoadStep((prev) => prev + 1);
    } else if (loadStep === -1) {
      // If cached URL fails, remove from cache and retry standard list
      verifiedLogoCache.delete(domain);
      try {
        localStorage.removeItem(`logo-url:${domain}`);
      } catch (e) {}
      setLoadStep(0);
    }
  };

  const sourceUrl =
    loadStep === -1 ? verifiedLogoCache.get(domain) : sources[loadStep];
  const displayUrl = persistedDataUrl || sourceUrl;
  const isFailedAll = persistedDataUrl ? false : loadStep >= sources.length;

  return (
    <div ref={inViewRef} className="w-full h-full relative flex items-center justify-center shrink-0 transition-opacity duration-[950ms] z-10">
      <AnimatePresence mode="wait">
        {!isFailedAll && displayUrl && shouldLoad ? (
          <>
            <div className="absolute inset-0 z-0 bg-white/5 rounded-xl transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: isLoaded ? 0 : 1 }} />
            <img
              key={displayUrl}
              src={displayUrl}
              alt={name}
              referrerPolicy="no-referrer"
              decoding="async"
              onError={handleError}
              onLoad={handleLoad}
              style={{
                ...getSmartFitStyles("logo") }}
              className={`w-full h-full max-w-full max-h-full relative z-10 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isLoaded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />
            
          </>
        ) : isFailedAll ? (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0 }}
            className="absolute inset-0 z-0 flex items-center justify-center transform-gpu"
          >
            {Placeholder}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
});

export const PortalCard = memo(function PortalCard({
  portal,
  categoryId,
  onSelect,
  index = 0,
  priority = false }: {
  portal: Portal;
  categoryId: string;
  onSelect?: (portal: Portal) => void;
  index?: number;
  priority?: boolean;
}) {
  const categoryTag = useMemo(() => {
    const rawType = (portal.type || categoryId || "").toLowerCase();
    if (
      rawType.includes("movie") ||
      rawType.includes("stream") ||
      rawType.includes("video")
    )
      return "Movies";
    if (rawType.includes("game") || rawType.includes("play")) return "Games";
    if (
      rawType.includes("software") ||
      rawType.includes("app") ||
      rawType.includes("apk") ||
      rawType.includes("os")
    )
      return "Software";
    if (rawType.includes("anime") || rawType.includes("manga")) return "Anime";
    if (rawType.includes("book")) return "Books";
    if (rawType.includes("torrent")) return "Torrents";
    return rawType.toUpperCase() || "WEB";
  }, [portal.type, categoryId]);

  const cardRef = React.useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = React.useState(false);
  const [reported, setReported] = React.useState(false);


  return (
    <motion.a
      href={portal.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onSelect) {
          e.preventDefault();
          e.stopPropagation();
          onSelect(portal as any);
        } else {
          e.stopPropagation();
        }
      }}
      
      variants={{
        hidden: { opacity: 0, scale: 0.98, y: 15 },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0,
          transition: { type: "spring", stiffness: 200, damping: 25, mass: 0.8, delay: (index % 15) * 0.03 }
        }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.02, y: -4, zIndex: 50, transition: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 } }}
      whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 400, damping: 25, mass: 1 } }}
      style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
      className="group block relative w-full aspect-[2/1] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] outline-none rounded-3xl overflow-hidden isolate  transform-gpu"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(150px circle at 50% 50%, rgba(168, 85, 247, 0.10), transparent 80%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-50"
        style={{
          boxShadow: `inset 0 0 0 1px radial-gradient(150px circle at 50% 50%, rgba(192, 132, 252, 0.3), transparent 50%)` }}
      />
      <div className="absolute inset-0 bg-white/[0.03] bg-gradient-to-br from-white/[0.06] to-transparent shadow-md rounded-3xl p-2 flex flex-col items-center justify-center transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 group-hover:border-white/30 group-hover:from-white/[0.1] group-hover:to-white/[0.01] relative isolate h-full overflow-hidden">
        {/* Hardware accelerated shadow */}
        <div className="absolute inset-0 rounded-3xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-[opacity] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms]" />

        <div className="absolute bottom-2 left-2 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms]">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              
              const subject = encodeURIComponent(`Broken Link Report: ${portal.name}`);
              const body = encodeURIComponent(`I'd like to report a broken link on the directory.\n\nName: ${portal.name}\nDomain: ${portal.domain}\nURL: ${portal.url}\n\nPlease check this link.`);
              window.location.href = `mailto:fahimahmedpc@gmail.com?subject=${subject}&body=${body}`;

              console.log(`[Broken Link Report] Domain: ${portal.domain}, URL: ${portal.url}`);
              toast.success(`Broken link reported for ${portal.name}`, { icon: '🚩', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
              setReported(true);
              if (window.navigator?.vibrate) window.navigator.vibrate(50);
              setTimeout(() => setReported(false), 2000);
            }}
            className="p-1.5 rounded-full bg-black/20 hover:bg-emerald-500/20 text-white/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 touch-manipulation"
            title="Report Broken Link"
          >
            {reported ? <Check size={14} className="text-emerald-400" /> : <Flag size={14} />}
          </button>
        </div>
        
        <div className="flex-1 min-h-0 flex items-center justify-center relative w-full p-2 overflow-visible transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.02]">
          <PortalLogo
            domain={portal.domain}
            name={portal.name}
            customLogo={portal.logo}
            categoryId={categoryId}
            priority={priority}
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full z-20 shrink-0 pb-2.5 pt-0">
          <span className="text-white/40 group-hover:text-white/90 font-medium transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 flex items-center gap-1.5 w-full justify-center overflow-hidden text-[11.5px] px-2">
            <ExternalLink size={11} className="opacity-40 group-hover:opacity-80 shrink-0 transition-opacity duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
            <span className="truncate block text-ellipsis break-all leading-none mt-0.5">
              {portal.domain}
            </span>
          </span>
        </div>
      </div>
    </motion.a>
  );
});

export interface Section {
  title: string;
  portals: Portal[];
}

export const GlassySkeletonLoader = ({
  count = 14,
  type = "portal",
  categoryType = "" }: {
  count?: number;
  type?: "portal" | "poster";
  categoryType?: string;
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) =>
        type === "portal" ? (
          <motion.div
            key={`skel-portal-${idx}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: idx * 0.04 }}
            
            className="search-result-modal rounded-3xl p-4 flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden aspect-[2/1] min-h-[110px] md:min-h-[130px] transform-gpu shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)] bg-[#0a0a0a]"
          >
            <div className="absolute inset-0 bg-white/[0.02]" />

            {/* Framer Motion Shimmer */}
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.06] to-transparent w-[200%]"
              animate={{ x: ["-100%", "50%"] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                ease: "linear",
                delay: idx * 0.1 }}
            />

            <div className="w-[95%] h-[75%] mb-2 relative shrink-0 rounded-xl bg-white/[0.05] z-10 overflow-hidden shadow-inner" />

            <div className="min-w-0 w-full flex flex-col items-center justify-center z-10">
              <div className="h-3 sm:h-4 w-1/2 bg-white/[0.08] rounded-full shadow-inner" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`skel-poster-${idx}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: idx * 0.04 }}
            
            className={`w-full relative overflow-hidden rounded-3xl search-result-modal shadow-inner transform-gpu border border-white/10 ${
              categoryType === "software" ||
              categoryType === "system" ||
              categoryType === "tool"
                ? "h-48 sm:h-56 md:h-64"
                : "aspect-[2/3]"
            }`}
          >
            <div className="absolute inset-0 bg-white/[0.03]" />
            <motion.div
              className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.08] to-transparent w-[200%]"
              animate={{ x: ["-100%", "50%"] }}
              transition={{
                repeat: Infinity,
                duration: 0.9,
                ease: "linear",
                delay: idx * 0.1 }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/40 to-transparent pointer-events-none opacity-90" />

            <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-20 pointer-events-none">
              <div className="h-4 bg-white/10 rounded border border-white/10 w-8" />
              <div className="h-4 bg-white/10 rounded border border-white/10 w-12" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 pointer-events-none z-10 flex flex-col justify-end items-center text-center">
              <div className="h-5 sm:h-6 bg-white/20 rounded-md w-3/4 mb-1" />
              <div className="h-3 sm:h-4 bg-white/10 rounded-md w-1/2" />
            </div>
          </motion.div>
        ),
      )}
    </>
  );
};

// CSS-level Virtualization Wrapper
export const VirtualGridItem = memo(({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div 
      ref={ref}
      className="w-full aspect-[2/1] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] "
      style={{ contain: "layout style" }}
    >
      {isInView ? children : null}
    </div>
  );
});

export default function DirectoryLayout({
  title,
  subtitle,
  description,
  portals,
  sections,
  categoryId,
  isLoading = false,
  advisory = "SECURITY_ADVISORY: While our automated probes verify connection integrity, users are strictly advised to deploy advanced encryption layers and secure VPN protocols before establishing a direct data uplink to external nodes." }: {
  title: string;
  subtitle: string;
  description: string;
  portals?: Portal[];
  sections?: Section[];
  categoryId: string;
  isLoading?: boolean;
  advisory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPortal(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    // Lock scrolling on search input focus
    if (isInputFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputFocused]);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      startTransition(() => {
        searchTimeoutRef.current = setTimeout(() => {
          setSearchQuery(val);
        }, 150);
      });
    },
    [],
  );

  const isScrolledRef = useRef(false);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 80;
          if (scrolled !== isScrolledRef.current) {
            isScrolledRef.current = scrolled;
            setIsScrolled(scrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [visibleCount, setVisibleCount] = useState(18);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    setVisibleCount(18);
  }, [searchQuery, activeCategory]);

  const loadingRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 18);
        }
      },
      { rootMargin: "400px" },
    );
    if (node) observerRef.current.observe(node);
  }, []);

  const Icon = ICON_MAP[categoryId] || Layers;

  const rawDisplaySections: Section[] = useMemo(() => {
    const isSearching = searchQuery.trim().length > 0;

    // Deduplication logic tracking across all sections
    const seenDomains = new Set<string>();
    const seenNames = new Set<string>();

    const filterDeduplicate = (portalsList: Portal[]) => {
      return portalsList.filter((n) => {
        const domainKey = n.domain
          .replace(/^www\./, "")
          .toLowerCase()
          .trim();
        const nameKey = n.name.toLowerCase().trim();
        if (seenDomains.has(domainKey) || seenNames.has(nameKey)) return false;
        seenDomains.add(domainKey);
        seenNames.add(nameKey);

        if (activeCategory !== "all") {
          const rawType = (n.type || categoryId || "").toLowerCase();
          let typeCategory = "system";
          if (
            rawType.includes("movie") ||
            rawType.includes("stream") ||
            rawType.includes("video")
          )
            typeCategory = "movie/tv";
          else if (rawType.includes("game") || rawType.includes("play"))
            typeCategory = "game";
          else if (
            rawType.includes("software") ||
            rawType.includes("app") ||
            rawType.includes("apk") ||
            rawType.includes("os")
          )
            typeCategory = "software";
          if (activeCategory !== typeCategory) return false;
        }
        return true;
      });
    };

    let baseSections = sections
      ? sections
          .map((s) => ({
            ...s,
            portals: filterDeduplicate(s.portals) }))
          .filter((s) => s.portals.length > 0)
      : portals
        ? [
            {
              title: "",
              portals: filterDeduplicate(portals) },
          ].filter((s) => s.portals.length > 0)
        : [];

    if (!isSearching) return baseSections;

    // Search Mode: Flatten, Filter, Sort by Release Date, Group by Category
    let allPortals = baseSections.flatMap((s) => s.portals);

    allPortals = allPortals.filter((n) => {
      const qStr = searchQuery.toLowerCase().trim();
      if (!qStr) return true;
      const tokens = qStr.split(/\s+/).filter(Boolean);

      const tStr = n.name.toLowerCase();
      const isExact = tStr === qStr;
      const isInclude = tStr.includes(qStr);

      if (isExact || isInclude) return true;

      let matchCount = 0;
      tokens.forEach((t) => {
        if (tStr.includes(t)) matchCount++;
      });
      if (tokens.length > 0 && matchCount / tokens.length >= 0.5) return true;
      return false;
    });

    allPortals.sort((a, b) => {
      const qStr = searchQuery.toLowerCase().trim();
      const aT = a.name.toLowerCase();
      const bT = b.name.toLowerCase();

      const aExact = aT === qStr;
      const bExact = bT === qStr;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

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

      const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
      const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
      return dateB - dateA;
    });

    const groups: Record<string, typeof allPortals> = {
      "🎬 Movies & Shows": [],
      "🎮 Video Games": [],
      "💻 Software & Apps": [],
      "⚡️ System & Tools": [],
      "📁 Other": [] };

    allPortals.forEach((n) => {
      const rawType = (n.type || categoryId || "").toLowerCase();
      if (
        rawType.includes("movie") ||
        rawType.includes("stream") ||
        rawType.includes("video") ||
        rawType.includes("anime")
      ) {
        groups["🎬 Movies & Shows"].push(n);
      } else if (rawType.includes("game") || rawType.includes("play")) {
        groups["🎮 Video Games"].push(n);
      } else if (
        rawType.includes("software") ||
        rawType.includes("app") ||
        rawType.includes("apk") ||
        rawType.includes("os") ||
        rawType.includes("tech")
      ) {
        groups["💻 Software & Apps"].push(n);
      } else if (
        rawType.includes("system") ||
        rawType.includes("util") ||
        rawType.includes("security")
      ) {
        groups["⚡️ System & Tools"].push(n);
      } else {
        groups["📁 Other"].push(n);
      }
    });

    return Object.entries(groups)
      .filter(([_, groupPortals]) => groupPortals.length > 0)
      .map(([title, groupPortals]) => ({ title, portals: groupPortals }));
  }, [sections, portals, searchQuery, activeCategory, categoryId]);

  const displaySections = useMemo(() => {
    let budget = visibleCount;
    return rawDisplaySections
      .map((section) => {
        if (budget <= 0) return { ...section, portals: [] };
        const slice = section.portals.slice(0, budget).map((portal) => {
          let url = portal.url;
          const query = searchQuery.trim();
          if (query !== '') {
            const strippedDomain = portal.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
            const provider = SEARCH_PROVIDERS.find(p => {
              const pDomain = p.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
              return pDomain === strippedDomain || strippedDomain.includes(pDomain);
            });
            if (provider && provider.getSearchUrl) {
              url = provider.getSearchUrl(query);
            }
          }
          return { ...portal, url };
        });
        budget -= slice.length;
        return { ...section, portals: slice };
      })
      .filter((s) => s.portals.length > 0);
  }, [rawDisplaySections, visibleCount, searchQuery]);

  const hasMorePortals = useMemo(() => {
    const total = rawDisplaySections.reduce(
      (acc, sec) => acc + sec.portals.length,
      0,
    );
    return visibleCount < total;
  }, [rawDisplaySections, visibleCount]);

  return (
    <div className="min-h-screen bg-transparent pt-8 md:pt-16 pb-10 px-2 md:px-4 relative">
      {/* Subtle Stars for Subpages */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute top-2/3 left-3/4 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-white rounded-full" />
      </div>

      <div className="w-[96%] max-w-[1800px] mx-auto px-1 sm:px-2 md:px-4 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 md:mb-16 gap-8">
          <div
            className={`max-w-3xl text-center lg:text-left mx-auto lg:mx-0 transition-opacity duration-[950ms] ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-5 md:mb-7"
            >
              <Icon size={12} />
              <span>Category: {subtitle}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 110, damping: 20, mass: 1 }}
              
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tightest text-slate-900 dark:text-white mb-5 md:mb-7 relative leading-[0.95] md:leading-[0.9] py-2 font-display uppercase"
            >
              <div className="text-gradient select-none">{title}</div>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 110, damping: 20, mass: 1,
                delay: 0.05 }}
              
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-white/50 font-light leading-relaxed mb-0 max-w-2xl border-l-0 lg:border-l border-slate-900/10 dark:border-white/10 pl-0 lg:pl-8 text-center lg:text-left"
            >
              {description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:max-w-md relative group mt-4 lg:mt-0 z-50 mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-[950ms] pointer-events-none" />
            <div className="relative flex items-center justify-end">
              <div className="hidden sm:block w-full">
                <Search
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isPending ? "text-indigo-500 animate-pulse" : "text-slate-500 dark:text-white/40 group-focus-within:text-indigo-500 dark:group-focus-within:text-purple-400"}`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search sites in this category (Fast Search)..."
                  onChange={handleSearchChange}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  defaultValue={searchQuery}
                  className="w-full bg-slate-900/5 dark:bg-[#0a0a10]/80 border border-slate-900/10 dark:border-white/10 rounded-[20px] pl-14 lg:pl-16 pr-6 text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 dark:focus:ring-purple-500/30 focus:bg-white/80 dark:group-focus-within:bg-[#0f0f18]/90 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] font-mono text-xs md:text-sm backdrop-blur-md shadow-sm py-4"
                />
              </div>
              <div className="sm:hidden w-full relative">
                <input
                  type="text"
                  placeholder="Search Nodes..."
                  onChange={handleSearchChange}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  defaultValue={searchQuery}
                  className="w-full bg-[#0a0a10]/80 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] font-mono text-sm backdrop-blur-md"
                />
                <Search
                  className={`absolute left-4 top-1/2 -translate-y-1/2 px-0 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isPending ? "text-indigo-500 animate-pulse" : "text-white/40 group-focus-within:text-indigo-400"}`}
                  size={18}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6 md:space-y-10 mt-8">
          {!isLoading &&
            displaySections.map((section, idx) => (
              <div
                key={`section-${section.title}-${idx}`}
                className="space-y-4 md:space-y-6 snap-start scroll-mt-24"
              >
                {section.title && (
                  <div className="relative">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex items-center gap-4 w-full justify-center">
                        <div className="h-px grow bg-gradient-to-l from-white/10 to-transparent" />
                        <div className="relative shrink-0">
                          <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-2xl opacity-50" />
                          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-2xl">
                            <Icon size={18} className="text-white/60" />
                          </div>
                        </div>
                        <div className="h-px grow bg-gradient-to-r from-white/10 to-transparent" />
                      </div>

                      <div className="space-y-1 text-center">
                        <h2 className="text-lg md:text-2xl font-black tracking-tight text-white uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40 font-display">
                          {section.title}
                        </h2>
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]" />
                          <span className="text-[7px] md:text-[8px] font-mono font-black tracking-[0.3em] text-white/30 uppercase">
                            {section.portals.length} NODES
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full mt-6"
                  style={{ gridAutoRows: "minmax(min-content, max-content)", contain: "content" }}
                >
                  <AnimatePresence initial={false}>
                    {section.portals.map((portal, pIdx) => (
                      <VirtualGridItem key={`${portal.name}-${pIdx}`}>
                        <PortalCard
                          portal={portal}
                          categoryId={categoryId}
                          onSelect={setSelectedPortal}
                          index={pIdx}
                          priority={pIdx < 12 && idx === 0}
                        />
                      </VirtualGridItem>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}

          {isLoading && (
            <div className="space-y-4 md:space-y-6">
              <div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full mt-6 px-1 sm:px-0"
                style={{ gridAutoRows: "minmax(min-content, max-content)" }}
              >
                <GlassySkeletonLoader count={12} />
              </div>
            </div>
          )}

          {!isLoading && displaySections.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center glass-panel rounded-[40px]"
            >
              <p className="text-white/20 font-mono text-sm tracking-widest uppercase">
                No portals matching sequence.
              </p>
            </motion.div>
          )}

          {hasMorePortals && (
            <div
              ref={loadingRef}
              className="w-full h-10 mt-6 pointer-events-none opacity-0"
            />
          )}
        </div>
      </div>

      {/* Premium Multi-Dimensional Context Sheet */}
      <AnimatePresence>
        {selectedPortal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              className="fixed inset-0 z-[100] detailed-interaction-overlay cursor-pointer"
              onClick={() => setSelectedPortal(null)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) setSelectedPortal(null);
              }}
              className="fixed bottom-0 left-0 right-0 z-[101] search-result-modal border-t border-white/10 rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10 max-h-[90vh] overflow-y-auto overscroll-none"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />

              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start max-w-4xl mx-auto">
                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-4">
                  <PortalLogo
                    domain={selectedPortal.domain}
                    name={selectedPortal.name}
                    categoryId={categoryId}
                    customLogo={selectedPortal.logo}
                  />
                </div>

                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                    {selectedPortal.tags?.slice(0, 3).map((tag, tagIdx) => (
                      <span
                        key={`${tag}-${tagIdx}`}
                        className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 text-white/70 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-2">
                    {selectedPortal.name}
                  </h2>
                  <p className="text-sm sm:text-base text-white/50 font-mono mb-6 max-w-xl leading-relaxed">
                    {selectedPortal.description}
                  </p>

                  {/* Premium Quality Links / Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-auto">
                    <a
                      href={selectedPortal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
                    >
                      LAUNCH
                      <ExternalLink size={16} />
                    </a>
                    <a
                      href={selectedPortal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
                    >
                      4K UHD PREMIUM
                    </a>
                    <a
                      href={selectedPortal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98]"
                    >
                      MAGNET TORRENT
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
