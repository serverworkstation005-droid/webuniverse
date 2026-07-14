import fs from 'fs';
import path from 'path';

function processDirectory(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Target the poster whileHover specifically:
            // whileHover={{ scale: 1.05, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 80, damping: 20, mass: 1.2 } }}
            content = content.replace(/stiffness:\s*80,\s*damping:\s*20,\s*mass:\s*1\.2/g, 'stiffness: 40, damping: 25, mass: 2.0');

            if (content !== original) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated poster hover in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(process.cwd(), 'src'));
console.log('Poster hover scales updated!');
