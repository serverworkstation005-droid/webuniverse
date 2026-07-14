import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react';
import { useLocation } from 'react-router-dom';

export default function MouseGlow() {
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  
  const springConfig = { damping: 24, stiffness: 100, mass: 0.8 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only show glow on the homepage initially
    setIsVisible(location.pathname === '/');

    const handleSearchActive = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === true) {
        setIsVisible(false);
      } else if (location.pathname === '/') {
        setIsVisible(true);
      }
    };

    window.addEventListener('search-active', handleSearchActive);
    return () => window.removeEventListener('search-active', handleSearchActive);
  }, [location.pathname]);

  useEffect(() => {
    if (!isVisible) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX); 
      mouseY.set(e.clientY);
    };
    
    // Use passive listener for better performance
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, isVisible]);

  const bgTemplate = useMotionTemplate`
    radial-gradient(
      800px circle at ${springX}px ${springY}px,
      rgba(99, 102, 241, 0.08),
      transparent 80%
    )
  `;

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0 hidden md:block mix-blend-screen"
      style={{
        background: bgTemplate }}
    />
  );
}
