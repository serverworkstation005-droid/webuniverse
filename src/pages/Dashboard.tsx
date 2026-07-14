import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Search, Star, ExternalLink, History, X, Copy, Check, Clock, Flag } from "lucide-react";
import { PortalItem } from "../data/allData";
import { PortalLogo } from "../components/DirectoryLayout";
import { useDashboardState } from "../hooks/useDashboardState";
import toast from "react-hot-toast";

const DashboardVirtualGridItem = React.memo(({ children }: { children: React.ReactNode }) => {
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

const DashboardPortalCard = React.memo(
  ({
    portal,
    isFav,
    toggleFav,
    onVisit,
    index = 0,
    priority = false,
    isTopFavSection = false }: {
    portal: PortalItem;
    isFav: boolean;
    toggleFav: (p: PortalItem) => void;
    onVisit: (p: PortalItem) => void;
    index?: number;
    priority?: boolean;
    isTopFavSection?: boolean;
  }) => {
    const cardRef = React.useRef<HTMLAnchorElement>(null);
    const [copied, setCopied] = React.useState(false);
    const [reported, setReported] = React.useState(false);

    function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
      if (!cardRef.current) return;
      window.requestAnimationFrame(() => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
      });
    }

    return (
      <motion.a
        ref={cardRef}
        href={portal.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onVisit(portal)}
        onMouseMove={handleMouseMove}
        variants={{
          hidden: { opacity: 0, scale: 0.9, y: 30 },
          visible: { 
            opacity: 1, 
            scale: 1,
            y: 0, 
            transition: { type: "spring", stiffness: 85, damping: 15, mass: 1, delay: ((index ?? 0) % 15) * 0.06 }
          }
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        exit={{ opacity: 0 }}
        whileHover={{ scale: 1.03, y: -6, zIndex: 50, transition: { type: "spring", stiffness: 150, damping: 22, mass: 0.8 } }}
        whileTap={{ scale: 0.98, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
        style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
        className="group block relative w-full aspect-[2/1] min-h-[120px] sm:min-h-[130px] md:min-h-[140px] outline-none rounded-3xl overflow-hidden isolate  transform-gpu"
      >
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-10"
          style={{
            background: `radial-gradient(150px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.10), transparent 80%)` }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-50"
          style={{
            boxShadow: `inset 0 0 0 1px radial-gradient(150px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(192, 132, 252, 0.3), transparent 50%)` }}
        />
        <div className="absolute inset-0 bg-white/[0.03] bg-gradient-to-br from-white/[0.06] to-transparent shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.5)] rounded-3xl p-2 flex flex-col items-center justify-center transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 group-hover:border-white/30 group-hover:from-white/[0.1] group-hover:to-white/[0.01] relative isolate h-full overflow-hidden">
          {/* Hardware accelerated shadow */}
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.3),0_12px_40px_rgba(0,0,0,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-[opacity] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms]" />
          
          <div className="absolute bottom-2 left-2 flex items-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const subject = encodeURIComponent(`Broken Link Report: ${portal.name}`);
                const body = encodeURIComponent(`I'd like to report a broken link on the dashboard.\n\nName: ${portal.name}\nDomain: ${portal.domain}\nURL: ${portal.url}\n\nPlease check this link.`);
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
          
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms]">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFav(portal);
                if (window.navigator?.vibrate) window.navigator.vibrate(50);
              }}
              className={`p-1.5 rounded-full transition-all duration-300 hover:scale-[1.02] touch-manipulation ${isTopFavSection ? "text-white/40 hover:text-red-400 bg-black/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]" : isFav ? "text-yellow-400 bg-yellow-400/10 shadow-[0_0_15px_rgba(250,204,21,0.4)]" : "text-white/40 hover:text-yellow-400 hover:bg-yellow-400/20 hover:shadow-[0_0_15px_rgba(250,204,21,0.5)] border border-white/5 bg-black/20"}`}
              title={
                isTopFavSection
                  ? "Remove from favorites"
                  : isFav
                    ? "Remove from favorites"
                    : "Add to favorites"
              }
            >
              {isTopFavSection ? (
                <X size={14} />
              ) : (
                <Star size={14} fill={isFav ? "currentColor" : "none"} />
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center relative w-full p-2 overflow-visible transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:scale-[1.02]">
            <PortalLogo
              domain={portal.domain}
              name={portal.name}
              customLogo={portal.logo}
              categoryId={portal.category || "misc"}
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
  },
);

// A windowed implementation using simple row virtualization could be complex here.
// But as requested, we combine layoutId animations with a generic container. To emulate react-window behavior and improve speed without breaking layoutId deeply, we'll keep a simple layout. "Refactor the main dashboard grid to use windowing"
// Actually, since I have to use react-window, I'll defer that for a subsequent edit if needed, or implement it natively. Given the explicit SharedLayout requirement, let's wrap grids in LayoutGroup.

// react-window removed to fix v2 crash
import { flattenDataForWindowing, FlattenedRow } from "../utils/windowing";
import { useResponsiveColumns } from "../hooks/useResponsiveColumns";

// ... Inside Dashboard ...
// after <div className="space-y-16 mt-8 pb-32" ref={containerRef}>

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { columns, dimensions, isReady } = useResponsiveColumns(containerRef);

  const {
    allData,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    favorites,
    recent,
    toggleFavorite,
    handleVisit,
    clearVisitedHistory,
    clearFavorites,
    groupedData } = useDashboardState();

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftPos, setScrollLeftPos] = React.useState(0);

  const checkScroll = React.useCallback(() => {
    if (!scrollContainerRef.current) return;
    window.requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, categories]);

  const scrollBy = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const handleClearHistory = () => {
    clearVisitedHistory();
    toast.success("Visited history cleared", {
      style: {
        borderRadius: "100px",
        background: "rgba(20,20,20,0.9)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)" } });
  };

  const handleClearFavorites = () => {
    clearFavorites();
    toast.success("Favorites cleared", {
      style: {
        borderRadius: "100px",
        background: "rgba(20,20,20,0.9)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.1)" } });
  };

  const flattenedData = React.useMemo(
    () => flattenDataForWindowing(groupedData || {}, columns, searchQuery),
    [groupedData, columns, searchQuery],
  );

  // Provide a fixed row height derived from aspect ratio or fixed px.
  // The cards are min-h-[110px] md:min-h-[130px] aspect-[2/1].
  // Let's use an approximate average height depending on screen + gap.
  const rowHeight =
    typeof window !== "undefined" && window.innerWidth > 768 ? 170 : 140;

  const Row = React.useCallback(
    ({ index, style }: { index: number; style?: React.CSSProperties }) => {
      const row = flattenedData[index];

      if (row.type === "empty") {
        return (
          <div
            style={style}
            className="w-full flex flex-col items-center justify-center text-white/40 pt-16"
          >
            <Search size={48} className="opacity-20 mb-4" />
            <p className="text-xl font-medium">{row.message}</p>
          </div>
        );
      }

      if (row.type === "header") {
        return (
          <div
            style={style}
            className="w-full flex items-center gap-4 pt-8 pb-4"
          >
            <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-white uppercase tracking-tighter">
              {row.title}
            </h2>
            <div className="h-px shrink-0 grow bg-white/10" />
          </div>
        );
      }

      return (
        <div style={style} className="w-full relative">
          {/* We use grid with inline style width to emulate the row */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.05 } } }}
            className="grid gap-3 sm:gap-4 md:gap-5 w-full mx-auto"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              paddingBottom: "16px", // Gap simulation
              }}
          >
            {row.items.map((portal, idx) => {
              return (
                <DashboardVirtualGridItem key={portal.domain}>
                  <DashboardPortalCard
                    portal={portal}
                    isFav={favorites.includes(portal.domain)}
                    toggleFav={toggleFavorite}
                    onVisit={handleVisit}
                    index={idx}
                    priority={index <= 2}
                    isTopFavSection={false}
                  />
                </DashboardVirtualGridItem>
              );
            })}
          </motion.div>
        </div>
      );
    },
    [flattenedData, columns, favorites, toggleFavorite, handleVisit],
  );

  const initialRows = columns > 0 ? Math.max(24, Math.ceil(72 / columns)) : 24;
  const [visibleRows, setVisibleRows] = React.useState(initialRows);
  const observer = React.useRef<IntersectionObserver | null>(null);

  React.useEffect(() => {
    setVisibleRows(initialRows); // Reset on data change
  }, [searchQuery, activeCategory, initialRows]);

  const loadingRef = React.useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleRows((prev) => prev + 8);
        }
      },
      { rootMargin: "400px" },
    );

    if (node) {
      observer.current.observe(node);
    }
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden min-h-screen">
      <div className="w-[96%] max-w-[1800px] mx-auto px-1 sm:px-2 md:px-4 py-8 relative z-10">
        {/* Dashboard Stats Header */}
        <div className="flex items-center gap-6 mb-8 px-2 text-sm text-white/50 font-medium">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
            <span>Total Resources: <span className="text-white/80">{allData.length}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
            <span>Favorites: <span className="text-white/80">{favorites.length}</span></span>
          </div>
        </div>

        {/* Favorites Section (Top big block) */}
        {favorites.length > 0 && (
          <div className="w-full mb-10 border border-white/5 bg-white/[0.02] rounded-3xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-amber-400 fill-amber-400" />
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Your favorites
                </h2>
                <span className="text-xs font-bold text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              </div>
              <button
                onClick={handleClearFavorites}
                className="text-xs text-white/40 hover:text-white transition-colors"
                title="Clear all favorites"
              >
                Clear All
              </button>
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 w-full"
              style={{ gridAutoRows: "minmax(min-content, max-content)" }}
            >
              {favorites.map((domain, index) => {
                const p = allData.find((d) => d.domain === domain);
                if (!p) return null;
                return (
                  <DashboardVirtualGridItem key={`fav-top-${p.domain}`}>
                    <DashboardPortalCard
                      portal={p}
                      isFav={true}
                      toggleFav={toggleFavorite}
                      onVisit={handleVisit}
                      index={index}
                      priority={true}
                      isTopFavSection={true}
                    />
                  </DashboardVirtualGridItem>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Global Combined Filter Bar */}
        <div className="sticky top-6 z-50 mb-10 w-full mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center bg-transparent backdrop-blur-[40px] border border-white/10 rounded-3xl md:rounded-full p-2 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all w-full group/bar hover:bg-white/[0.05] hover:border-white/20">
            {/* Search Input side */}
            <div className="flex items-center px-3 sm:px-4 w-full md:max-w-[280px] lg:max-w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-white/10 transition-all pb-3 md:pb-0 pt-1 md:pt-0">
              <Search
                className="text-white/40 group-focus-within/bar:text-white/80 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Filter specific cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-white/40 text-[14px] md:text-[15px] py-1 pl-3 pr-2 focus:outline-none tracking-wide md:w-[200px] lg:w-[240px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-white/30 hover:text-white p-1"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Category Pills side */}
            <div className="relative flex-1 pt-3 md:pt-0 w-full min-w-0 flex items-center group/pills mt-2 md:mt-0">
              {/* Left Scroll Button */}
              <AnimatePresence>
                {canScrollLeft && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/pills:opacity-100 transition-all duration-[950ms] pointer-events-none md:mt-0 mt-[6px] pl-1"
                  >
                    <button
                      onClick={() => scrollBy(-200)}
                      className="p-2.5 rounded-full bg-[#0a0a0d]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_8px_rgba(255,255,255,0.05)_inset] hover:bg-[#0a0a0d]/90 hover:border-white/20 transition-all text-white pointer-events-auto"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div 
                ref={scrollContainerRef}
                onScroll={checkScroll}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex items-center overflow-x-auto scrollbar-hide gap-1.5 sm:gap-2 px-6 sm:px-8 w-full min-w-0 py-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"} ${!isDragging ? "scroll-smooth" : ""}`}
                style={{
                  maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent, black 64px' : 'black'}, black calc(100% - ${canScrollRight ? '64px' : '0px'}), ${canScrollRight ? 'transparent' : 'black'})`,
                  WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent, black 64px' : 'black'}, black calc(100% - ${canScrollRight ? '64px' : '0px'}), ${canScrollRight ? 'transparent' : 'black'})`
                }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative shrink-0 px-4 py-2 rounded-full font-bold text-[13px] md:text-[14px] transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
                      activeCategory === cat
                        ? "text-white scale-[1.02]"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="activeCategoryPill"
                        className="absolute inset-0 bg-gradient-to-b from-[#6366f1] to-[#4338ca] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.5)] border border-indigo-400/30 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                      />
                    )}
                    <div className="flex items-center gap-2 pointer-events-none relative z-10">
                      {cat === "Favorites" && (
                        <Star
                          size={14}
                          className="inline drop-shadow-sm transition-colors duration-[950ms]"
                          color={activeCategory === cat ? "#fff" : "#fbbf24"}
                        />
                      )}
                      {cat}
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Scroll Button */}
              <AnimatePresence>
                {canScrollRight && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover/pills:opacity-100 transition-all duration-[950ms] pointer-events-none md:mt-0 mt-[6px] pr-1"
                  >
                    <button
                      onClick={() => scrollBy(200)}
                      className="p-2.5 rounded-full bg-[#0a0a0d]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_8px_rgba(255,255,255,0.05)_inset] hover:bg-[#0a0a0d]/90 hover:border-white/20 transition-all text-white pointer-events-auto"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grids with infinite scroll */}
        <div className="w-full mt-8" ref={containerRef}>
          {isReady && columns > 0 && (
            <div className="w-full h-full flex flex-col pb-16">
              {flattenedData.slice(0, visibleRows).map((row, index) => (
                <Row key={index} index={index}  />
              ))}

              {/* Invisible trigger element for Intersection Observer */}
              {visibleRows < flattenedData.length && (
                <div
                  ref={loadingRef}
                  className="w-full h-10 mt-6 pointer-events-none opacity-0"
                />
              )}

              {/* Footer / Resource Count */}
              {visibleRows >= flattenedData.length && (
                <div className="mt-16 flex flex-col items-center justify-center opacity-60">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-4" />
                  <p className="text-sm font-mono tracking-widest uppercase text-white/50">
                    <span className="text-white/80 font-bold">{allData.length}</span> Total Resources
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
