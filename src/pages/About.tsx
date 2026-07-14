import React from 'react';
import { motion } from 'motion/react';
import { Globe2, Shield, Zap, Compass, Star } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-8 relative z-10 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
        className="text-center mb-12 max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-4">About Web Universe</h1>
        <p className="text-white/50 text-lg">Your ultimate gateway to the internet's most valuable resources, curated for quality and speed.</p>
      </motion.div>

      <div className="w-full max-w-4xl space-y-16">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
          className="bg-[#12121a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sm:p-12 text-center"
        >
          <Globe2 className="w-16 h-16 text-indigo-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
            Web Universe was created to solve a simple problem: finding high-quality, working websites in an increasingly cluttered internet. We carefully curate, categorize, and verify every link in our directory to ensure you spend less time searching and more time enjoying content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              icon: Shield,
              title: "Verified Quality",
              desc: "Every site in our directory is manually checked for safety, quality, and reliability."
            },
            {
              icon: Zap,
              title: "Instant Access",
              desc: "Lightning-fast search and categorization gets you exactly what you need in seconds."
            },
            {
              icon: Compass,
              title: "Organized Hub",
              desc: "From movies to software, everything is neatly categorized into intuitive sections."
            },
            {
              icon: Star,
              title: "Community Driven",
              desc: "We grow through user requests, adding the best sites recommended by our community."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              className="bg-[#12121a]/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8"
            >
              <item.icon className="w-10 h-10 text-indigo-400 mb-4" />
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
