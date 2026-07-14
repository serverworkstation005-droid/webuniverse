import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export default function ParallaxWrapper({ children, offset = 50, className = "" }: ParallaxWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ 
    target: ref, 
    offset: ["start end", "end start"] 
  });
  
  const smoothY = useSpring(scrollYProgress, { 
    stiffness: 110, damping: 20, mass: 1 
  });
  
  const y = useTransform(smoothY, [0, 1], [offset, -offset]);

  return (
    <motion.div ref={ref} style={{ y }} className={`w-full will-change-transform ${className}`}>
      {children}
    </motion.div>
  );
}
