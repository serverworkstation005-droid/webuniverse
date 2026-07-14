import React from 'react';
import { motion } from 'motion/react';
import DeveloperInfo from '@/src/components/Developer';

export default function DeveloperPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4">The Developer</h1>
        <p className="text-white/50 text-lg">Meet the creator behind Web Universe.</p>
      </motion.div>

      <div className="w-full max-w-[1400px] px-4 md:px-8">
        <DeveloperInfo />
      </div>
    </div>
  );
}
