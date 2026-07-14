import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const TiltCardWrapper = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  const springConfig = { damping: 24, stiffness: 100, mass: 0.8 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], isMobile ? [0, 0] : [8, -8]);
  const rotateY = useTransform(smoothX, [0, 1], isMobile ? [0, 0] : [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transform: "translateZ(0)",
        willChange: "transform",
        ...style
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
