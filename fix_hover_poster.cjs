const fs = require('fs');
const path = require('path');

function modifyFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Increase hover animations: scale 1.02 -> 1.04, y: -6 -> y: -10
    content = content.replace(/whileHover=\{\{ scale: 1\.02, y: -6, zIndex: 50, transition: \{ type: "spring", stiffness: 150, damping: 20, mass: 1\.2 \} \}\}/g, 
                             'whileHover={{ scale: 1.04, y: -8, zIndex: 50, transition: { type: "spring", stiffness: 120, damping: 18, mass: 1.5 } }}');
    
    // Also increase active category pill animation
    content = content.replace(/stiffness: 150, damping: 20, mass: 1\.2/g, 'stiffness: 120, damping: 18, mass: 1.5');
    
    // Smooth appear animations
    content = content.replace(/delay: Math\.min\(index \* 0\.05, 0\.4\)/g, 'delay: Math.min(index * 0.08, 0.6)');
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated hover in ${filePath}`);
    }
}

modifyFile(path.join(__dirname, 'src/components/DirectoryLayout.tsx'));
modifyFile(path.join(__dirname, 'src/pages/Dashboard.tsx'));
modifyFile(path.join(__dirname, 'src/pages/SmartSearch.tsx'));
