const fs = require('fs');

function processFile(file, isDashboard = false) {
    let content = fs.readFileSync(file, 'utf8');

    // Remove the loader
    if (!isDashboard) {
        content = content.replace(/\{!isLoaded && \(\s*<motion\.div\s*key="loader"[\s\S]*?<\/svg>\s*<\/motion\.div>\s*\)\}/g, '');
        
        // Update PortalCard variants
        content = content.replace(
            /variants=\{\{\s*hidden: \{ opacity: 0, y: 15 \},\s*visible: \{\s*opacity: 1,\s*y: 0,\s*transition: \{ duration: 0\.4, ease: "easeOut", delay: \(index % 12\) \* 0\.04 \}\s*\}\s*\}\}/g,
            'variants={{\n        hidden: { opacity: 0, scale: 0.9, y: 30 },\n        visible: { \n          opacity: 1, \n          scale: 1,\n          y: 0,\n          transition: { type: "spring", stiffness: 100, damping: 20, mass: 0.8, delay: (index % 12) * 0.05 }\n        }\n      }}'
        );
    } else {
        // Update DashboardPortalCard variants
        content = content.replace(
            /variants=\{\{\s*hidden: \{ opacity: 0, y: 15 \},\s*visible: \{\s*opacity: 1,\s*y: 0,\s*transition: \{ duration: 0\.4, ease: "easeOut", delay: \(index \?\? 0\) % 15 \* 0\.04 \}\s*\}\s*\}\}/g,
            'variants={{\n          hidden: { opacity: 0, scale: 0.9, y: 30 },\n          visible: { \n            opacity: 1, \n            scale: 1,\n            y: 0, \n            transition: { type: "spring", stiffness: 100, damping: 20, mass: 0.8, delay: ((index ?? 0) % 15) * 0.05 }\n          }\n        }}'
        );
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
}

processFile('src/components/DirectoryLayout.tsx', false);
processFile('src/pages/Dashboard.tsx', true);
