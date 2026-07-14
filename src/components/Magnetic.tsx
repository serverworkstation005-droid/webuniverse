import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 45, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Premium, organic spring configuration
  const springConfig = { damping: 24, stiffness: 100, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      if (isHovered) {
        const time = performance.now() * 0.0035;
        // Non-uniform living pulse using a mixture of distinct prime-ratio frequencies
        const primaryPulse = Math.sin(time);
        const secondaryPulse = Math.sin(time * 2.3) * 0.6;
        const tertiaryPulse = Math.sin(time * 5.7) * 0.25;
        // High frequency micro instability representing unstable dynamic tension/jitter
        const randomJitter = (Math.sin(time * 19.3) * Math.cos(time * 11.7)) * 0.18;
        
        const organicWave = (primaryPulse + secondaryPulse + tertiaryPulse + randomJitter) / 2.0;
        scale.set(1.055 + organicWave * 0.005);
      } else {
        scale.set(1);
      }
      frameId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isHovered, scale]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    x.set(0);
    y.set(0);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  return (
    <motion.div 
      ref={ref} 
      style={{ 
        x: springX, 
        y: springY,
        scale: springScale }} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="inline-block magnetic"
    >
      {children}
    </motion.div>
  );
}
