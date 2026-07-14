import { motion, useScroll, useSpring, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  Home,
  Info,
  User,
  Send,
  Activity, 
  Sun, 
  Moon,
  MonitorPlay,
  Clapperboard,
  Gamepad2,
  Magnet,
  Sparkles,
  Package,
  Library,
  Keyboard,
  Zap,
  LayoutDashboard,
  ChevronRight,
  Shield
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/src/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '@/src/constants';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  MonitorPlay,
  Clapperboard,
  Gamepad2,
  Magnet,
  Sparkles,
  Package,
  Library,
  Keyboard,
  Zap
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 110, damping: 20, mass: 1,
    restDelta: 0.001
  });

  const [theme, setTheme] = useState('dark');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleSearchActive = (e: CustomEvent<boolean>) => setIsSearchActive(e.detail);
    window.addEventListener('search-active' as any, handleSearchActive);
    return () => window.removeEventListener('search-active' as any, handleSearchActive);
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-global-search'));
  };

  const isScrolledRef = useRef(false);
  const isHiddenRef = useRef(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Scrolled state
    const shouldBeScrolled = latest > 50;
    if (shouldBeScrolled !== isScrolledRef.current) {
      isScrolledRef.current = shouldBeScrolled;
      setIsScrolled(shouldBeScrolled);
    }

    // Hidden State
    let shouldBeHidden = isHiddenRef.current;
    if (latest > 150 && latest > previous) {
      shouldBeHidden = true;
    } else if (latest < previous) {
      shouldBeHidden = false;
    }

    // Protect Navbar on Home Page unless Searching
    if (location.pathname === '/' && !isSearchActive) {
      shouldBeHidden = false;
    }

    if (shouldBeHidden !== isHiddenRef.current) {
      isHiddenRef.current = shouldBeHidden;
      setIsHidden(shouldBeHidden);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={isHidden ? "hidden" : "visible"}
      transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 flex flex-col',
        isScrolled 
          ? 'h-14 md:h-16 border-b border-indigo-500/10 bg-[#06060c]/20 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]' 
          : 'h-14 md:h-16 bg-transparent transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]'
      )}
    >
      <div className="w-[96%] h-full max-w-[1800px] mx-auto px-1 sm:px-2 md:px-4 flex items-center justify-between gap-4 md:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="flex items-center gap-3 shrink-0"
        >
          <Link
            to="/" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              if (window.location.pathname === "/") {
                window.location.reload();
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 group"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-10 group-hover:opacity-30 transition-opacity duration-[950ms]" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center group-hover:scale-[1.02] group-hover:rotate-[6deg] transition-all duration-[950ms] shadow-2xl border border-white/10 overflow-hidden isolate">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4),transparent)]" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-[4px] shadow-[0_0_15px_rgba(255,255,255,0.6)] rotate-45 group-hover:rotate-0 transition-all duration-[950ms]" />
                {/* Internal shine effect */}
                <div className="absolute -left-full top-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:left-full transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </div>
            </div>
            <div className="flex flex-col -gap-0.5">
              <span className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter uppercase text-white font-display leading-[0.85] sm:leading-none pt-0.5">
                Web<span className="text-shimmer">Universe</span>
              </span>
              <div className="flex items-center gap-1.5 mt-1 sm:mt-0.5">
                <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[7.5px] sm:text-[8px] font-black tracking-[0.4em] text-white/35 uppercase font-mono">Universal Hub</span>
              </div>
            </div>
          </Link>
        </motion.div>

                <motion.div className="hidden md:flex flex-1 justify-center items-center gap-1.5 lg:gap-2 xl:gap-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          {[
            { path: '/', label: 'Home', icon: Home },
            { path: '/request', label: 'Request', icon: Send },
            { path: '/developer', label: 'Developer', icon: User },
            { path: '/about', label: 'About', icon: Info },
            { path: '/dmca', label: 'DMCA', icon: Shield }
          ].map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                variants={{ hidden: { opacity: 0, y: -20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 } } }}
              >
              <Link
                to={item.path}
                onClick={(e) => {
                  if (location.pathname === item.path && item.path === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.dispatchEvent(new CustomEvent('reset-home'));
                  }
                }}
                className={`relative shrink-0 px-4 py-2 rounded-full font-bold text-[13px] md:text-[14px] transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-10 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98] ${
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navActivePill"
                    className="absolute inset-0 bg-gradient-to-b from-[#6366f1] to-[#4338ca] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(0,0,0,0.5)] border border-indigo-400/30 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                  />
                )}
                <Icon size={14} className={cn("transition-colors duration-[950ms] relative z-10", isActive ? "text-white" : "text-white/40 group-hover:text-indigo-400")} />
                <span className="relative z-10 drop-shadow-md">{item.label}</span>
              </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden lg:flex items-center gap-3 mr-1 md:mr-2 border-r border-white/10 pr-3 sm:pr-5">
             <a href="https://www.facebook.com/fahim.ahmmed.210" target="_blank" rel="noreferrer" title="Facebook" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#1877F2]/80 hover:to-[#1877F2] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(24,119,242,0.4)] hover:border-[#1877F2]/50 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-facebook-f text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>
             <a href="https://www.linkedin.com/in/fahim-ahmed-3b1b712b1" target="_blank" rel="noreferrer" title="LinkedIn" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#0A66C2]/80 hover:to-[#0A66C2] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(10,102,194,0.4)] hover:border-[#0A66C2]/50 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-linkedin-in text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>
             <a href="https://wa.me/8801911759260" target="_blank" rel="noreferrer" title="WhatsApp" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#25D366]/80 hover:to-[#25D366] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(37,211,102,0.4)] hover:border-[#25D366]/50 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-whatsapp text-[18px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>
             <button title="Email" onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))} className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#EA4335]/80 hover:to-[#EA4335] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(234,67,53,0.4)] hover:border-[#EA4335]/50 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fas fa-envelope text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </button>
          </div>

          <button 
            className="md:hidden p-3 rounded-full hover:bg-white/5 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-white/40 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden md:block">
              <Link 
                to="/developer"
                className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-white/20 bg-white/5 overflow-hidden flex items-center justify-center group cursor-pointer relative transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] isolate shadow-md hover:shadow-cyan-500/20"
                style={{ display: 'block' }}
              >
                <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.2)] opacity-100 group-hover:opacity-0 transition-opacity duration-[950ms] pointer-events-none"  />
                <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(34,211,238,0.6)] border border-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-[950ms] pointer-events-none"  />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:bg-cyan-500/40 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
                <img 
                  src="/fahim.jpg" 
                  alt="Fahim Ahmed" 
                  className="w-full h-full object-cover relative z-10 filter brightness-110 contrast-125 grayscale-[30%]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute inset-0 border-[3px] border-cyan-500/0 group-hover:border-cyan-400/40 rounded-full z-20 transition-all duration-[950ms]" />
              </Link>
          </div>
        </div>
      </div>

      {/* Modern Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 origin-left z-[100]"
        style={{ scaleX }}
      />


      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[110%] left-0 right-0 glass-card mx-4 rounded-3xl border border-white/10 md:hidden bg-black/95 backdrop-blur-2xl overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-6">
              <Link 
                to="/"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 flex items-center justify-center gap-4 text-white hover:bg-white/10 transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              >
                <span className="text-[13px] font-bold uppercase tracking-[0.2em]">Home</span>
              </Link>

              <div className="flex flex-col gap-3">
                <Link 
                  to="/request"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn("w-full border rounded-xl py-3.5 px-4 flex items-center gap-3 transition-all duration-[950ms] active:scale-[0.98] relative overflow-hidden group", location.pathname === '/request' ? "bg-indigo-500/10 border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]")}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-[950ms]", location.pathname === '/request' ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-white/30 group-hover:bg-indigo-400/50")} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] flex-1 relative z-10">Request a Site</span>
                </Link>
                <Link 
                  to="/developer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn("w-full border rounded-xl py-3.5 px-4 flex items-center gap-3 transition-all duration-[950ms] active:scale-[0.98] relative overflow-hidden group", location.pathname === '/developer' ? "bg-indigo-500/10 border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]")}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-[950ms]", location.pathname === '/developer' ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-white/30 group-hover:bg-indigo-400/50")} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] flex-1 relative z-10">Developer</span>
                </Link>
                <Link 
                  to="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn("w-full border rounded-xl py-3.5 px-4 flex items-center gap-3 transition-all duration-[950ms] active:scale-[0.98] relative overflow-hidden group", location.pathname === '/about' ? "bg-indigo-500/10 border-indigo-500/30 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]" : "bg-white/5 border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]")}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-[950ms]", location.pathname === '/about' ? "bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "bg-white/30 group-hover:bg-indigo-400/50")} />
                  <span className="text-[12px] font-bold uppercase tracking-[0.15em] flex-1 relative z-10">About Universe</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5">
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-[950ms] border border-transparent",
                    location.pathname === "/dashboard" 
                      ? "bg-indigo-600/20 border-indigo-500/30 text-white font-bold" 
                      : "text-white/60 hover:text-white hover:bg-white/5 hover:border-white/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg flex items-center justify-center transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                      location.pathname === "/dashboard" ? "bg-indigo-500 text-white" : "bg-white/5 text-indigo-400"
                    )}>
                      <LayoutDashboard size={14} />
                    </div>
                    <span className="text-xs font-black tracking-wider uppercase font-display">
                      SYSTEM_DASHBOARD
                    </span>
                  </div>
                  <ChevronRight size={14} className="text-white/10" />
                </Link>
              </div>

              {/* Categorized Portals Section */}
              <div className="border-t border-white/5 pt-4">
                <div className="px-4 mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase font-black">
                    EXPLORE PORTALS
                  </span>
                  <span className="text-[9px] font-mono text-indigo-400/50 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase tracking-widest">
                    {CATEGORIES.length} Active
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[45vh] overflow-y-auto custom-scrollbar pr-1">
                  {CATEGORIES.map((cat) => {
                    const Icon = ICON_MAP[cat.icon] || Zap;
                    const isActive = location.pathname === cat.link;
                    return (
                      <Link
                        key={cat.id}
                        to={cat.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-[950ms] border border-transparent group",
                          isActive 
                            ? "bg-indigo-600/20 border-indigo-500/30 text-white font-bold" 
                            : "text-white/60 hover:text-white hover:bg-white/5 hover:border-white/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-1.5 rounded-lg flex items-center justify-center transition-colors duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
                            isActive ? "bg-indigo-500 text-white" : "bg-white/5 text-indigo-400 group-hover:text-indigo-300"
                          )}>
                            <Icon size={14} className="shrink-0" />
                          </div>
                          <span className="text-xs font-black tracking-wider uppercase font-display">
                            {cat.title}
                          </span>
                        </div>
                        <ChevronRight size={14} className={cn("transition-transform duration-[950ms] text-white/10 group-hover:text-white/30", isActive && "text-indigo-400 translate-x-0.5")} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
