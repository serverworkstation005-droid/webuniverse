import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { Search, Sparkles, Zap, Tv, Globe, ShieldCheck, Clapperboard, Gamepad2, Package, Magnet, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Magnetic from './Magnetic';

export default function Hero() {
  const { scrollY } = useScroll();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [hasScrolled, setHasScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 10 && !hasScrolled) {
      setHasScrolled(true);
    }
  });

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<string>) => {
      setTheme(e.detail);
    };
    window.addEventListener('theme-changed' as any, handleThemeChange);
    return () => window.removeEventListener('theme-changed' as any, handleThemeChange);
  }, []);

  // Gentle Spring-smoothed scroll position for zero-jitter, buttery parallax
  const smoothScrollY = useSpring(scrollY, { damping: 24, stiffness: 100 });

  // Custom parallax translations, scaling, and rotations for deep organic parallax depth
  const yBlobA = useTransform(smoothScrollY, [0, 1000], [0, -150]);
  const scaleBlobA = useTransform(smoothScrollY, [0, 800], [1, 1.18]);
  
  const yBlobB = useTransform(smoothScrollY, [0, 1000], [0, 140]);
  const scaleBlobB = useTransform(smoothScrollY, [0, 800], [0.9, 0.75]);
  
  const yBlobC = useTransform(smoothScrollY, [0, 1000], [0, -90]);
  const scaleBlobC = useTransform(smoothScrollY, [0, 800], [1, 1.1]);
  
  const rotateOrbit = useTransform(smoothScrollY, [0, 1000], [0, 60]);
  const scaleOrbit = useTransform(smoothScrollY, [0, 1000], [1, 0.8]);
  const opacityGrid = useTransform(smoothScrollY, [0, 500], [0.35, 0.05]);

  const heroContentY = useTransform(smoothScrollY, [0, 800], [0, 250]);
  const heroContentOpacity = useTransform(smoothScrollY, [0, 500], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set((e.clientX / window.innerWidth - 0.5) * 12);
          mouseY.set((e.clientY / window.innerHeight - 0.5) * 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 24, stiffness: 100 }; // Soft, premium, luxurious inertia timing
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const isDark = theme === 'dark';

  return (
    <section className="relative min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center pb-8 px-4 sm:px-6 md:px-12 overflow-hidden pt-24 md:pt-32 select-none">
      
      {/* Background Ambient Blur & Interactive Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        
        {/* Layer 1: Global Deep Glow Aura (Breathes and has parallax) */}
        <motion.div 
          style={{ y: yBlobA, scale: scaleBlobA }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-indigo-500/[0.045] dark:bg-indigo-500/[0.035] blur-[100px] will-change-transform" 
        />

        {/* Layer 2: Ambient Cyber Orchid Ring (Parallax opposite movement) */}
        <motion.div 
          style={{ y: yBlobB, scale: scaleBlobB }}
          className="absolute top-1/3 left-[20%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full bg-purple-500/[0.03] dark:bg-purple-500/[0.02] blur-[90px] will-change-transform" 
        />

        {/* Layer 3: Cyan Accent Cosmic Particle */}
        <motion.div 
          style={{ y: yBlobC, scale: scaleBlobC }}
          className="absolute top-1/2 right-[15%] w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] rounded-full bg-cyan-500/[0.03] dark:bg-cyan-500/[0.02] blur-[110px] will-change-transform animate-pulse" 
        />

        {/* Layer 4: Geometric Subtle Orbit Grid */}
        <motion.div 
          style={{ rotate: rotateOrbit, scale: scaleOrbit, opacity: opacityGrid }}
          className="absolute top-[15%] left-[25%] md:left-[35%] w-96 h-96 sm:w-[32rem] sm:h-[32rem] rounded-full border border-dashed border-indigo-500/5 dark:border-indigo-400/10 pointer-events-none will-change-transform"
        />

        {/* Subtle Ambient Dots in background that track mouse perfectly with fine-tuned spring */}
        <motion.div 
          style={{ translateX: springX, translateY: springY }}
          className="absolute top-1/4 left-[10%] w-1 sm:w-1.5 h-1 sm:h-1.5 bg-indigo-500/20 rounded-full dark:bg-indigo-400/35"
        />
        <motion.div 
          style={{ translateX: useTransform(springX, (val) => -val * 0.8), translateY: useTransform(springY, (val) => -val * 0.8) }}
          className="absolute top-1/2 right-[8%] w-1.5 sm:w-2 h-1.5 sm:h-2 bg-pink-500/15 rounded-full dark:bg-pink-400/25"
        />
      </div>

      <motion.div style={{ y: heroContentY, opacity: heroContentOpacity }} className="relative z-10 w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="max-w-5xl mx-auto w-full flex flex-col items-center"
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[9px] sm:text-[10px] uppercase font-black tracking-[0.4em] mb-6 sm:mb-8 animate-pulse ${
            isDark 
              ? "border-white/10 bg-white/[0.03] text-white/50" 
              : "border-slate-200 bg-slate-100 text-slate-500 shadow-sm"
          }`}
        >
          <Sparkles size={11} className={isDark ? "text-white/60" : "text-indigo-500"} />
          Gateway to the Digital Future
        </motion.div>
        
        <motion.h1 
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] md:leading-[0.9] tracking-tighter mb-4 sm:mb-6 pointer-events-none isolate font-display perspective-[1000px] gpu-layer flex flex-col items-center"
        >
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.2 }}
            className={`block will-change-[transform,opacity] ${isDark ? "text-white" : "text-slate-900"}`}
          >
            THE WEB
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.3 }}
            className="text-shimmer block will-change-[transform,opacity]"
          >
            UNIVERSE
          </motion.span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.4 }}
          
          className={`max-w-3xl text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-4 px-2 sm:px-6 tracking-wide gpu-layer ${
            isDark ? "text-white/50" : "text-slate-600"
          }`}
        >
          Experience an <span className={`${isDark ? "text-white/85" : "text-slate-800"} font-black transition-colors duration-[950ms]`}>elite universe</span> of the world&apos;s most premium resources. Explore a curated index of verified Premium cross-platform 4K Movies & Shows, Games, Softwares, Torrents, Anime, Tech Utilities—all the web&apos;s most valuable resources in one beautiful slot.
        </motion.p>

        {/* Highlight badge about search power without any emojis */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.45 }}
          
          className={`mb-10 flex flex-wrap items-center justify-center gap-2.5 px-5 py-2.5 rounded-2xl border backdrop-blur-xl text-center max-w-2xl select-none ${
            isDark 
              ? "bg-indigo-500/[0.06] border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.1)]" 
              : "bg-indigo-50/50 border-indigo-100 shadow-[0_8px_25px_rgba(99,102,241,0.05)]"
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping shrink-0" />
          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${
            isDark ? "text-white/90" : "text-indigo-950"
          }`}>
            REVOLUTIONARY DISCOVERY ENGINE: Instant, unified real-time checks across 100+ premium target websites.
          </span>
        </motion.div>

        {/* Integrated Search Bar inside Glass Plate */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.5 }}
          className="w-full max-w-4xl px-2 will-change-[transform,opacity] gpu-layer flex flex-col items-center justify-center mb-16 relative"
        >
          <Link to="/search" className="w-full max-w-4xl mx-auto group focus:outline-none block">
            <div className="relative w-full transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]-[transform,shadow] duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02]">
              {/* Outer glow aura */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-indigo-550 to-purple-600 rounded-full opacity-20 blur-md group-hover:opacity-60 transition-all duration-[950ms]" />
              
              <div className={`relative flex items-center ${isDark ? 'bg-[#07070b]/90' : 'bg-white/90'} backdrop-blur-xl border ${isDark ? 'border-white/10 group-hover:border-indigo-500/50' : 'border-indigo-100 group-hover:border-indigo-400/60 shadow-[0_8px_30px_rgba(99,102,241,0.08)]'} rounded-full p-2 lg:p-2.5 shadow-2xl transition-all duration-[950ms]`}>
                <div className={`pl-4 sm:pl-6 transition-colors duration-[950ms] ${isDark ? 'text-white/40 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-cyan-500'}`}>
                  <Search className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-[950ms] group-hover:scale-[1.02]" />
                </div>
                
                <div className={`flex-1 w-full bg-transparent border-none text-base sm:text-lg lg:text-xl font-bold tracking-tight px-4 truncate select-none text-left transition-colors duration-[950ms] ${isDark ? 'text-white/30 group-hover:text-white/70' : 'text-slate-400 group-hover:text-slate-700'}`}>
                  Search any movie, show, video game, or software app...
                </div>
                
                <div className="flex-none hidden sm:flex items-center pr-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors duration-[950ms] ${isDark ? 'bg-white/5 border-white/10 group-hover:bg-white/10' : 'bg-slate-100 border-slate-200 group-hover:bg-slate-200'}`}>
                    <span className={`text-[10px] sm:text-xs font-bold select-none ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-slate-400 group-hover:text-slate-500'}`}>PRESS</span>
                    <kbd className={`text-[11px] sm:text-xs font-mono font-black px-1.5 rounded border shadow-inner ${isDark ? 'text-white/70 bg-black/20 border-white/5 group-hover:text-white' : 'text-slate-600 bg-white border-slate-200 group-hover:text-slate-800'}`}>/</kbd>
                    <span className={`text-[10px] sm:text-xs font-bold select-none ${isDark ? 'text-white/40 group-hover:text-white/60' : 'text-slate-400 group-hover:text-slate-500'}`}>TO FOCUS</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Smart Interactive Category Filters Row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-1">
            {[
              { id: "all", label: "Smart Scan", icon: Sparkles },
              { id: "movies", label: "Movies & Shows", icon: Clapperboard },
              { id: "games", label: "Games", icon: Gamepad2 },
              { id: "software", label: "Software & OS", icon: Package },
              { id: "anime", label: "Anime Index", icon: Tv },
              { id: "torrents", label: "Torrents", icon: Magnet }
            ].map((cat) => {
              const Icon = cat.icon;
              const isActive = cat.id === "all";
              return (
                <Link
                  key={cat.id}
                  to="/search"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-tight border transition-all duration-[950ms] shadow-sm cursor-pointer select-none ${
                    isActive 
                      ? "bg-indigo-600 border-indigo-505 text-white shadow-lg shadow-indigo-650/20 scale-[1.02]" 
                      : isDark
                        ? "bg-[#0b0c15]/60 hover:bg-[#121325]/85 border-white/5 text-white/50 hover:text-white"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Icon size={12} className={isActive ? "animate-pulse text-cyan-300" : (isDark ? "opacity-75" : "text-slate-400")} />
                  <span>{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 pointer-events-none z-50"
          >
            <div className={`w-6 h-10 rounded-full border-2 flex justify-center p-1 ${isDark ? 'border-white/20' : 'border-indigo-500/30'}`}>
              <motion.div 
                animate={{ y: [0, 12, 0] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/50' : 'bg-indigo-500'}`}
              />
            </div>
            <span className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-white/40' : 'text-indigo-500/50'}`}>Scroll</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
