import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import React, { useEffect, useState, useRef } from 'react';
import { Linkedin } from 'lucide-react';
import ParallaxWrapper from './ParallaxWrapper';

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayedText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

export default function Developer() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ clientX, clientY }: React.MouseEvent) {
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

  return (
    <section id="developer" className="py-8 md:py-12 px-2 sm:px-4 md:px-6 pb-12 relative w-full">
      <ParallaxWrapper offset={40}>
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="flex flex-wrap md:flex-row items-center justify-center gap-10 md:gap-24 lg:gap-32 w-full">
          {/* Developer Info Card */}
          <div className="w-full text-center md:text-left">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
              onMouseMove={handleMouseMove}
              className="will-change-[transform,opacity] group bg-[#12121a]/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-12 lg:p-16 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden isolate"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-[950ms] group-hover:opacity-100 mix-blend-screen"
                style={{
                  background: `radial-gradient(250px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.10), transparent 80%)` }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition duration-[950ms] group-hover:opacity-100"
                style={{
                  background: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.08%22/%3E%3C/svg%3E")',
                  WebkitMaskImage: `radial-gradient(200px circle at var(--mouse-x, 0) var(--mouse-y, 0), white, transparent 80%)` }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-0 transition duration-[950ms] group-hover:opacity-100 z-20"
                style={{
                  boxShadow: `inset 0 0 0 1px radial-gradient(200px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(192, 132, 252, 0.3), transparent 50%)` }}
              />

              {/* Premium Background Effects inside Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none -z-10" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
              <div className="absolute inset-0 border border-white/[0.05] rounded-[2rem] pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 relative z-10 w-full xl:pl-10">
                
                {/* Developer Image inside Card */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                    whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1 }}
                    className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-[340px] md:h-[340px] rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" 
                  />
                  
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)", rotate: -5 }}
                    whileInView={{ scale: 1, opacity: 1, filter: "blur(0px)", rotate: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ type: "spring", stiffness: 110, damping: 20, mass: 1, delay: 0.2 }}
                    className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-[320px] md:h-[320px] rounded-full overflow-hidden z-10 border-4 border-white shadow-[0_0_40px_rgba(34,211,238,0.15)] bg-[#12121a]"
                  >
                    <img 
                      src="/fahim.jpg" 
                      alt="Fahim Ahmed" 
                      loading="lazy"
                      className="w-full h-full object-cover scale-[1.05] filter brightness-110 contrast-125 grayscale-[10%] transition-transform duration-[950ms] hover:scale-[1.12]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                  </motion.div>
                </div>

                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.055, delayChildren: 0.2 }
                    }
                  }}
                  className="flex-1 text-center md:text-left flex flex-col justify-center"
                >
                  <motion.h2 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight text-white mb-6 uppercase leading-tight font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    <span className="text-white/50 text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.2em] block mb-2 font-sans">DESIGNED & DEVELOPED BY</span> 
                    Fahim Ahmed
                  </motion.h2>
                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 w-full"
                  >
                    <span className="px-6 py-3 rounded-[14px] bg-white/5 border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-white/80 shadow-md backdrop-blur-md">
                      Web Developer
                    </span>
                    <span className="px-6 py-3 rounded-[14px] bg-white/5 border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-[0.1em] text-white/80 shadow-md backdrop-blur-md">
                      IT Specialist
                    </span>
                  </motion.div>
                  <motion.p 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                    className="text-base sm:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl font-medium min-h-[100px]"
                  >
                    <TypewriterText text="I am Fahim Ahmed, a passionate Web Developer and IT Specialist. WebUniverse is my vision of a perfectly organized digital gateway, built with precision and a relentless focus on performance." />
                  </motion.p>

                  <motion.div 
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2, staggerChildren: 0.2, delayChildren: 0.6 } } }}
                    className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full"
                  >
                      <motion.a 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 } }}
                        whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
                        href="https://www.facebook.com/fahim.ahmmed.210" 
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors duration-[950ms] shadow-lg hover:shadow-[#1877F2]/20 touch-manipulation"
                        title="Facebook"
                      >
                        <i className="fab fa-facebook-f text-2xl"></i>
                      </motion.a>
                      <motion.a 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 } }}
                        whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
                        href="https://www.linkedin.com/in/fahim-ahmed-3b1b712b1" 
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors duration-[950ms] shadow-lg hover:shadow-[#0A66C2]/20 touch-manipulation"
                        title="LinkedIn"
                      >
                        <i className="fab fa-linkedin-in text-2xl"></i>
                      </motion.a>
                      <motion.a 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 } }}
                        whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
                        href="https://wa.me/8801911759260" 
                        target="_blank"
                        rel="noreferrer"
                        className="group relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors duration-[950ms] shadow-lg hover:shadow-[#25D366]/20 touch-manipulation"
                        title="WhatsApp"
                      >
                        <i className="fab fa-whatsapp text-[26px]"></i>
                      </motion.a>
                      <motion.button 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 45, damping: 20, mass: 2 } } }}
                        whileHover={{ scale: 1.1, transition: { type: "spring", stiffness: 100, damping: 15, mass: 1.2 } }}
                        whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 150, damping: 15, mass: 1 } }}
                        onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))}
                        title="Email"
                        className="group relative flex items-center justify-center w-16 h-16 sm:w-14 sm:h-14 rounded-2xl bg-[#EA4335]/10 border border-[#EA4335]/20 text-[#EA4335] hover:bg-[#EA4335] hover:text-white transition-colors duration-[950ms] shadow-lg hover:shadow-[#EA4335]/20 touch-manipulation"
                      >
                        <i className="fas fa-envelope text-[24px]"></i>
                      </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </ParallaxWrapper>
    </section>
  );
}
