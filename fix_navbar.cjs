const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, 'src/components/Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Change Link mapping to be animated.
navbarContent = navbarContent.replace(
  /className="hidden md:flex flex-1 justify-center items-center gap-1.5 lg:gap-2 xl:gap-3"/,
  'className="hidden md:flex flex-1 justify-center items-center gap-1.5 lg:gap-2 xl:gap-3"\n          initial="hidden"\n          animate="visible"\n          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}'
);
navbarContent = navbarContent.replace(
  /<div className="hidden md:flex flex-1 justify-center items-center gap-1\.5 lg:gap-2 xl:gap-3"/,
  '<motion.div className="hidden md:flex flex-1 justify-center items-center gap-1.5 lg:gap-2 xl:gap-3"'
);

navbarContent = navbarContent.replace(
  /<\/div>\s*<div className="flex items-center gap-3 sm:gap-5">/,
  '</motion.div>\n\n        <div className="flex items-center gap-3 sm:gap-5">'
);

navbarContent = navbarContent.replace(
  /return \(\s*<Link/g,
  'return (\n              <motion.div\n                key={item.path}\n                variants={{ hidden: { opacity: 0, y: -20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 20, mass: 1 } } }}\n              >\n              <Link'
);

navbarContent = navbarContent.replace(
  /<\/span>\s*<\/Link>\s*\);/g,
  '</span>\n              </Link>\n              </motion.div>\n            );'
);

// We need to fix the key on Link since we moved it to motion.div
navbarContent = navbarContent.replace(
  /<Link\s*key=\{item\.path\}/g,
  '<Link'
);

// Update social buttons
navbarContent = navbarContent.replace(/<a href="https:\/\/www\.facebook\.com.*?<\/a>/gs, 
  `<a href="https://www.facebook.com/fahim.ahmmed.210" target="_blank" rel="noreferrer" title="Facebook" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#1877F2]/80 hover:to-[#1877F2] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(24,119,242,0.4)] hover:border-[#1877F2]/50 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-facebook-f text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>`);

navbarContent = navbarContent.replace(/<a href="https:\/\/www\.linkedin\.com.*?<\/a>/gs, 
  `<a href="https://www.linkedin.com/in/fahim-ahmed-3b1b712b1" target="_blank" rel="noreferrer" title="LinkedIn" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#0A66C2]/80 hover:to-[#0A66C2] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(10,102,194,0.4)] hover:border-[#0A66C2]/50 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-linkedin-in text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>`);

navbarContent = navbarContent.replace(/<a href="https:\/\/wa\.me.*?<\/a>/gs, 
  `<a href="https://wa.me/8801911759260" target="_blank" rel="noreferrer" title="WhatsApp" className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#25D366]/80 hover:to-[#25D366] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(37,211,102,0.4)] hover:border-[#25D366]/50 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fab fa-whatsapp text-[18px] relative z-10 group-hover:drop-shadow-md"></i>
             </a>`);

navbarContent = navbarContent.replace(/<button title="Email".*?<\/button>/gs, 
  `<button title="Email" onClick={() => window.dispatchEvent(new CustomEvent('open-contact-modal'))} className="w-12 h-12 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-gradient-to-b hover:from-[#EA4335]/80 hover:to-[#EA4335] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_6px_12px_rgba(234,67,53,0.4)] hover:border-[#EA4335]/50 transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] active:scale-[0.95] touch-manipulation relative overflow-hidden group">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[800ms] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_50%)]"></div>
               <i className="fas fa-envelope text-[16px] relative z-10 group-hover:drop-shadow-md"></i>
             </button>`);

// Update duration of navlinks to 800ms
navbarContent = navbarContent.replace(/duration-\[600ms\]/g, 'duration-[800ms]');
// Update the 3D pill spring animation for a softer effect
navbarContent = navbarContent.replace(/stiffness: 200, damping: 25, mass: 0.8/g, 'stiffness: 150, damping: 20, mass: 1');

fs.writeFileSync(navbarPath, navbarContent, 'utf8');
console.log('Updated Navbar');
