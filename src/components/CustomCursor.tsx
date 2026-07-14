import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const opacityValue = useMotionValue(0);

  const springConfigOuter = { stiffness: 110, damping: 20, mass: 1 };
  const springConfigInner = { stiffness: 110, damping: 20, mass: 1 };

  const outerX = useSpring(mouseX, springConfigOuter);
  const outerY = useSpring(mouseY, springConfigOuter);
  const innerX = useSpring(mouseX, springConfigInner);
  const innerY = useSpring(mouseY, springConfigInner);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
      if (opacityValue.get() === 0) opacityValue.set(1);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, opacityValue]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-indigo-500/50 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: outerX,
          y: outerY,
          opacity: opacityValue }}
        animate={{
          scale: isHovering ? 1.5 : 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          x: innerX,
          y: innerY,
          translateX: 12, // (32 - 8) / 2 to center the 8x8 inside 32x32, wait 2x2. (32 - 2) / 2 = 15. So if outer is -16, inner should be -4. Wait, mouse is e.clientY. outerX = mouse - 16. innerX should be mouse - 4. So innerX = outerX + 12
          translateY: 12,
          opacity: opacityValue }}
        animate={{
          scale: isHovering ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
      />
    </>
  );
};
