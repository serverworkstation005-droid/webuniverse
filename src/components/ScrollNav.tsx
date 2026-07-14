import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScrollNav() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 110, damping: 20, mass: 1 } }}
          exit={{ opacity: 0, scale: 0.8, x: 20 }}
          
          className="fixed bottom-6 right-4 sm:right-6 md:right-8 z-50 flex flex-col gap-2"
        >
          <button
            onClick={scrollToTop}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-card bg-indigo-500/20 hover:bg-indigo-500/40 border border-white/10 hover:border-indigo-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-[950ms] shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform duration-[950ms]" />
          </button>
          
          <button
            onClick={scrollToBottom}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-card bg-indigo-500/20 hover:bg-indigo-500/40 border border-white/10 hover:border-indigo-400/50 flex items-center justify-center text-white/70 hover:text-white transition-all duration-[950ms] shadow-[0_0_15px_rgba(0,0,0,0.5)] group"
            aria-label="Scroll to bottom"
          >
            <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform duration-[950ms]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
