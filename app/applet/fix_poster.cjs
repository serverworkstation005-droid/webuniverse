const fs = require('fs');

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    // Make tailwind hover ultra smooth
    content = content.replace(/group-hover:-translate-y-3 group-hover:scale-\[1\.05\]/g, 'group-hover:-translate-y-3 group-hover:scale-[1.05]');
    // Wait, the ease function is ease-[cubic-bezier(0.16,1,0.3,1)] and duration is 1200ms
    // Let's change the wrapper to motion.div in SmartSearch.tsx

    let regex = /<div\s+className={`poster-wrapper w-full relative overflow-hidden rounded-\[16px\] xl:rounded-\[20px\] transition-all duration-\[1200ms\] ease-\[cubic-bezier\(0\.16,1,0\.3,1\)\] border border-white\/10 \$\{\s+entity\.type === "software" \|\|\s+entity\.type === "system" \|\|\s+entity\.type === "tool"\s+\? "h-48 sm:h-56 md:h-64 flex items-center justify-center bg-white\/\[0\.03\]"\s+: "aspect-\[2\/3\] bg-white\/\[0\.03\]"\s+\} origin-center transform-gpu group-hover:-translate-y-3 group-hover:scale-\[1\.05\] group-hover:bg-slate-900 z-10 \$\{\w+ === \w+ \? "-translate-y-3 scale-\[1\.05\] bg-slate-900 z-20" : ""\}`}\s+>/g;

    const newContent = `<motion.div
        whileHover={{ scale: 1.05, y: -12, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        whileTap={{ scale: 0.98, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        className={\`poster-wrapper w-full relative overflow-hidden rounded-[16px] xl:rounded-[20px] transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] border border-white/10 \${
          entity.type === "software" ||
          entity.type === "system" ||
          entity.type === "tool"
            ? "h-48 sm:h-56 md:h-64 flex items-center justify-center bg-white/[0.03]"
            : "aspect-[2/3] bg-white/[0.03]"
        } origin-center transform-gpu group-hover:bg-slate-900 z-10 \${focusedPosterIndex === idx ? "bg-slate-900 z-20" : ""}\`}
      >`;

    // It's safer to just change the transition classes on the div
    content = content.replace(/transition-all duration-\[1200ms\] ease-\[cubic-bezier\(0\.16,1,0\.3,1\)\]/g, 'transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)]');

    fs.writeFileSync(file, content, 'utf8');
}
processFile('src/pages/SmartSearch.tsx');
processFile('src/components/DirectoryLayout.tsx');
