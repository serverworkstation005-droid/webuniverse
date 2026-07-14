const fs = require('fs');
const path = require('path');

function processFile(file, replacers) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    replacers.forEach(([regex, replacement]) => {
        content = content.replace(regex, replacement);
    });
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed', file);
    }
}

// 1. SmartSearch.tsx
processFile('/app/applet/src/pages/SmartSearch.tsx', [
    // poster wrapper
    [/duration-\[900ms\]/g, 'duration-[1200ms]'],
    [/group-hover:scale-\[1\.02\]/g, 'group-hover:scale-[1.05]'],
    [/group-hover:-translate-y-2/g, 'group-hover:-translate-y-3'],
    [/-translate-y-2 scale-\[1\.02\]/g, '-translate-y-3 scale-[1.05]']
]);

// 2. Developer.tsx
processFile('/app/applet/src/components/Developer.tsx', [
    // Fix the missing visible transition
    [/transition:\s*\{\s*type:\s*"spring",\s*stiffness:\s*180,\s*damping:\s*25,\s*mass:\s*0\.8,\s*staggerChildren:\s*0\.15,\s*delayChildren:\s*0\.6\s*\}/g, 'transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.25, delayChildren: 0.6 }'],
    
    // Also increase duration on social button hover
    [/duration-\[900ms\]/g, 'duration-[1200ms]'],
    [/scale-\[1\.02\]/g, 'scale-[1.05]'],
    [/hover:scale-\[1\.1\]/g, 'hover:scale-[1.12]'],
    
    // Just for good measure, make sure staggering is smoother
    [/staggerChildren:\s*0\.15/g, 'staggerChildren: 0.25'],
    [/scale:\s*1\.08/g, 'scale: 1.1'] // make hover a bit bigger
]);

console.log('Done');
