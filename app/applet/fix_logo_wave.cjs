const fs = require('fs');
const content = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

// We want to change the <motion.img ... /> in PortalLogo to just a regular <img /> with no opacity transition.
// Or we can just change initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} 
// to initial={{ opacity: 1 }} animate={{ opacity: 1 }}

let newContent = content.replace(
    /initial=\{\{ opacity: 0 \}\}\s*animate=\{\{ opacity: isLoaded \? 1 : 0 \}\}\s*exit=\{\{ opacity: 0 \}\}\s*transition=\{\{ type: "spring", stiffness: 110, damping: 20, mass: 1 \}\}/g,
    'initial={{ opacity: 1 }}\n              animate={{ opacity: 1 }}\n              exit={{ opacity: 1 }}\n              transition={{ duration: 0 }}'
);

// We should also make the card wave animation a bit more pronounced for a "smooth wave"
newContent = newContent.replace(
    /transition: \{ type: "spring", stiffness: 100, damping: 20, mass: 0\.8, delay: \(index % 12\) \* 0\.05 \}/g,
    'transition: { type: "spring", stiffness: 85, damping: 15, mass: 1, delay: (index % 15) * 0.06 }'
);

fs.writeFileSync('src/components/DirectoryLayout.tsx', newContent, 'utf8');

let dashboardContent = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
dashboardContent = dashboardContent.replace(
    /transition: \{ type: "spring", stiffness: 100, damping: 20, mass: 0\.8, delay: \(\(index \?\? 0\) % 15\) \* 0\.05 \}/g,
    'transition: { type: "spring", stiffness: 85, damping: 15, mass: 1, delay: ((index ?? 0) % 15) * 0.06 }'
);
fs.writeFileSync('src/pages/Dashboard.tsx', dashboardContent, 'utf8');

console.log('Fixed PortalLogo loading scene and enhanced wave animation.');
