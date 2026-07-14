import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface CursorState {
  type: 'default' | 'hover' | 'explore' | 'search' | 'text';
  label: string;
  element: HTMLElement | null;
}

export default function AuraCursor() {
  const [cursorState, setCursorState] = useState<CursorState>({
    type: 'default',
    label: '',
    element: null,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent<string>) => setTheme(e.detail);
    window.addEventListener('theme-changed' as any, handleThemeChange);
    return () => window.removeEventListener('theme-changed' as any, handleThemeChange);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let reqId: number;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Advanced requestAnimationFrame pure hardware translation
    const update = () => {
      currentX += (targetX - currentX) * 0.25; // Kinetic smoothing (Apple iOS dampening config)
      currentY += (targetY - currentY) * 0.25;
      
      if (cursorRef.current) {
        cursorRef.current.style.setProperty('--mouse-x', `${currentX}px`);
        cursorRef.current.style.setProperty('--mouse-y', `${currentY}px`);
      }
      reqId = requestAnimationFrame(update);
    };
    reqId = requestAnimationFrame(update);

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setIsVisible(true);
    };
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseout', onMouseLeave, { passive: true });

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseout', onMouseLeave);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const clickable = target.closest('a, button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (clickable) {
        if (target.closest('input[type="text"], input[type="search"], textarea')) {
          setCursorState({ type: 'text', label: '', element: clickable as HTMLElement });
        } else if (target.closest('button[type="submit"]') || target.closest('input[name="query"]')) {
           setCursorState({ type: 'search', label: '', element: clickable as HTMLElement });
        } else if (clickable.tagName.toLowerCase() === 'a' && (clickable as HTMLAnchorElement).target === '_blank') {
          setCursorState({ type: 'explore', label: 'OPEN', element: clickable as HTMLElement });
        } else {
          setCursorState({ type: 'hover', label: '', element: clickable as HTMLElement });
        }
      } else {
        setCursorState({ type: 'default', label: '', element: null });
      }
    };
    
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  if (isMobile || !isVisible) return null;

  const isDark = theme === 'dark';
  const isTextType = cursorState.type === 'text';

  // Map cursor type to dimension scales
  const sizeMap = {
    default: 16,
    hover: 48,
    explore: 64,
    search: 72,
    text: 4,
  };
  
  const size = sizeMap[cursorState.type] || 16;
  const clickScale = isClicked ? 0.8 : 1;

  return (
    <div 
      ref={cursorRef} 
      className="fixed inset-0 pointer-events-none z-[999] overflow-hidden"
    >
      <div 
        style={{
          transform: `translate3d(calc(var(--mouse-x) - 50%), calc(var(--mouse-y) - 50%), 0) scale(${clickScale})`,
          width: isTextType ? 4 : size,
          height: isTextType ? 28 : size,
          transition: 'width 0.25s cubic-bezier(0.23, 1, 0.32, 1), height 0.25s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.25s, border-radius 0.25s',
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.05)',
          border: isTextType ? 'none' : isDark ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid rgba(15,23,42,0.2)',
          borderRadius: isTextType ? '2px' : '50%',
          backdropFilter: isDark ? 'blur(2px)' : 'none',
        }}
        className="will-change-[transform,width,height] flex items-center justify-center absolute top-0 left-0"
      >
        {cursorState.label && (
          <span className={cn("text-[9px] font-black tracking-[0.14em] text-center select-none whitespace-nowrap", isDark ? "text-white" : "text-slate-900")}>
            {cursorState.label}
          </span>
        )}
      </div>
      
      {!isTextType && (
        <div 
          style={{
            transform: `translate3d(calc(var(--mouse-x) - 50%), calc(var(--mouse-y) - 50%), 0)`,
          }}
          className={cn(
             "absolute top-0 left-0 w-2 h-2 rounded-full will-change-transform transition-all duration-300 pointer-events-none",
             cursorState.type !== 'default' ? "scale-0 opacity-0" : "scale-100 opacity-100",
             isDark ? "bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.7)]" : "bg-slate-800/90"
          )}
        />
      )}
    </div>
  );
}
