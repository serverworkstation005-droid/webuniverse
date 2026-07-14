import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { type Category } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { Link } from 'react-router-dom';
import { memo, useRef, MouseEvent } from 'react';

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = memo(function CategoryCard({ category, index }: CategoryCardProps) {
  const Icon = (LucideIcons as any)[category.icon] || LucideIcons.HelpCircle;
  const isInternal = category.link.startsWith('/');

  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ clientX, clientY }: MouseEvent) {
    if (!cardRef.current) return;
    window.requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  // Derived theme color for CSS variables
  const themeColor = category.color.includes('blue') ? '#3b82f6' :
                     category.color.includes('purple') ? '#a855f7' :
                     category.color.includes('emerald') ? '#10b981' :
                     category.color.includes('orange') ? '#f97316' :
                     category.color.includes('pink') ? '#ec4899' :
                     category.color.includes('cyan') ? '#06b6d4' :
                     category.color.includes('amber') ? '#f59e0b' :
                     category.color.includes('rose') ? '#f43f5e' :
                     category.color.includes('sky') ? '#0ea5e9' : '#6366f1';

  const CardContent = (
    <div 
      ref={cardRef}
      style={{ '--theme-color': themeColor } as any}
      onMouseMove={handleMouseMove}
      className="relative h-full min-h-[220px] lg:min-h-[280px] glass-card rounded-3xl p-6 md:p-8 lg:p-10 flex flex-col justify-between group cursor-pointer transition-all duration-[950ms] hover:border-white/30 overflow-hidden isolate gpu-layer ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-10"
        style={{
          background: `radial-gradient(250px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.10), transparent 80%)`
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-10"
        style={{
          background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.06%22/%3E%3C/svg%3E")',
          WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x, 0) var(--mouse-y, 0), white, transparent 80%)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition duration-[950ms] group-hover:opacity-100 z-20 mix-blend-overlay"
        style={{
          boxShadow: `inset 0 0 0 1px radial-gradient(200px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(192, 132, 252, 0.3), transparent 50%)`
        }}
      />
      <div className="space-y-4 md:space-y-6 lg:space-y-8 relative z-10">
        <div
          className={cn(
            "w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-[1.25rem] flex items-center justify-center border transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden",
            "bg-white/[0.03] border-white/[0.08] group-hover:border-white/20 group-hover:bg-white/[0.06]"
          )}
        >
          <Icon 
            className="text-white opacity-60 group-hover:opacity-100 transition-all duration-[950ms] hover:scale-[1.02] ease-[cubic-bezier(0.16,1,0.3,1)] lg:w-8 lg:h-8" 
            size={26} 
          />
        </div>

        <div className="space-y-3 md:space-y-4 lg:space-y-5 group-hover:translate-x-1.5 transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)]">
          <h3 className="text-lg md:text-xl lg:text-[28px] leading-tight font-black tracking-tightest text-white group-hover:text-white transition-colors duration-[950ms] font-display uppercase">
            {category.title}
          </h3>
          <p className="text-xs md:text-sm lg:text-[15px] text-white/30 leading-relaxed font-light group-hover:text-white/60 transition-colors duration-[950ms] line-clamp-2 lg:line-clamp-3">
            {category.description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 md:mt-8 lg:mt-10 relative z-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-green-500/90 relative z-10" />
            </div>
            <span className="text-[9px] font-black tracking-[0.4em] text-white/50 uppercase font-mono transition-all duration-[950ms] group-hover:text-white/80 group-hover:tracking-[0.5em] ease-[cubic-bezier(0.16,1,0.3,1)]">
              LINK_{category.id.toUpperCase()}
            </span>
          </div>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-[1.5px] w-8 md:w-0 group-hover:w-full bg-white/20 transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] origin-left" 
          />
        </div>
        
        <div className={cn(
          "relative w-10 h-10 md:w-11 md:h-11 lg:w-14 lg:h-14 rounded-full border border-white/40 md:border-white/[0.1] flex items-center justify-center transition-all duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] bg-white/10 md:bg-white/[0.03] backdrop-blur-3xl md:backdrop-blur-md gpu-layer",
          "group-hover:bg-white group-hover:text-black group-hover:scale-[1.02] group-hover:border-transparent group-hover:rotate-12"
        )}>
          <LucideIcons.ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:rotate-45 transition-transform duration-[950ms] ease-[cubic-bezier(0.16,1,0.3,1)] raw-icon relative z-10 text-white group-hover:text-black" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "group relative h-full transition-all duration-[950ms] hover:-translate-y-2 active:scale-[0.97] gpu-layer ease-[cubic-bezier(0.16,1,0.3,1)]",
        "cursor-pointer"
      )}
    >
      {isInternal ? (
        <Link to={category.link} className="block h-full cursor-default">
          {CardContent}
        </Link>
      ) : (
        <a href={category.link} target="_blank" rel="noopener noreferrer" className="block h-full">
          {CardContent}
        </a>
      )}
    </div>
  );
});

export default CategoryCard;

