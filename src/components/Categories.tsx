import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { CATEGORIES } from '@/src/constants';
import CategoryCard from './CategoryCard';
import ParallaxWrapper from './ParallaxWrapper';
import { ChevronDown } from 'lucide-react';

export default function Categories() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<string>) => {
      setTheme(e.detail);
    };
    window.addEventListener('theme-changed' as any, handleThemeChange);
    return () => window.removeEventListener('theme-changed' as any, handleThemeChange);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Soft elastic spring to filter out mouse scroll wheel jitter
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 110, damping: 20, mass: 1,
    restDelta: 0.001
  });

  const titleScale = useTransform(smoothScrollYProgress, [0, 0.3], [0.95, 1]);
  const titleTracking = useTransform(smoothScrollYProgress, [0, 0.3], ["0.1em", "0em"]);
  const titleOpacity = useTransform(smoothScrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Render all directory categories directly as requested by the user
  const filteredCategories = CATEGORIES;

  return (
    <section 
      id="categories" 
      ref={containerRef} 
      className={`pb-8 md:pb-12 px-2 sm:px-4 md:px-6 relative overflow-hidden isolate transition-colors duration-[950ms] bg-transparent`}
    >
      <ParallaxWrapper offset={30}>
        <div className="max-w-[1600px] w-full mx-auto px-2 md:px-6">
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8 text-center">
          <motion.div
            style={{ scale: titleScale, opacity: titleOpacity }}
            className="flex flex-col items-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-4 md:gap-6"
            >
              {/* Sophisticated Navigation Feedback - simpler for performance */}
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center opacity-60"
                >
                  <ChevronDown size={32} className={theme === "dark" ? "text-white" : "text-slate-800"} />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                  className="flex flex-col items-center gap-1.5 animate-pulse"
                >
                   <span className={`text-[13px] md:text-[15px] font-black uppercase tracking-[0.8em] font-display italic ml-[0.8em] ${
                     theme === "dark" ? "text-white/90" : "text-slate-800"
                   }`}>
                    Explore directory portals
                   </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>



        {/* Categories List Display with smooth entrance animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5 min-h-[300px] w-full">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: Math.min(index * 0.05, 0.4) }}
                key={category.id}
                className="h-full"
              >
                <CategoryCard category={category} index={index} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className={theme === "dark" ? "text-white/30 font-medium" : "text-slate-400 font-medium"}>
                No categories matching this filter.
              </p>
            </div>
          )}
        </div>
      </div>
      </ParallaxWrapper>
    </section>
  );
}
