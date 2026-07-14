const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Update hover/tap physics to stiffness: 500, damping: 30
            content = content.replace(/whileHover=\{\{(.*?)\}\}/g, (match, inner) => {
                let newInner = inner;
                if (newInner.includes('transition:')) {
                    newInner = newInner.replace(/transition:\s*\{[^}]+\}/, 'transition: { type: "spring", stiffness: 500, damping: 30 }');
                } else {
                    newInner += ', transition: { type: "spring", stiffness: 500, damping: 30 }';
                }
                return `whileHover={{${newInner}}}`;
            });

            content = content.replace(/whileTap=\{\{(.*?)\}\}/g, (match, inner) => {
                let newInner = inner;
                if (newInner.includes('transition:')) {
                    newInner = newInner.replace(/transition:\s*\{[^}]+\}/, 'transition: { type: "spring", stiffness: 500, damping: 30 }');
                } else {
                    newInner += ', transition: { type: "spring", stiffness: 500, damping: 30 }';
                }
                return `whileTap={{${newInner}}}`;
            });

            // Tweaked entrance stagger delays
            content = content.replace(/delay:\s*idx\s*\*\s*0\.05/g, 'delay: idx * 0.03');
            content = content.replace(/staggerChildren:\s*0\.1/g, 'staggerChildren: 0.05');
            content = content.replace(/delay:\s*Math\.min\(index\s*\*\s*0\.1,\s*0\.5\)/g, 'delay: Math.min(index * 0.04, 0.3)');
            // specific to index * 0.1 or so
            content = content.replace(/delay:\s*index\s*\*\s*0\.1\b/g, 'delay: index * 0.04');
            content = content.replace(/delay:\s*index\s*\*\s*0\.05\b/g, 'delay: index * 0.03');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Done!');
