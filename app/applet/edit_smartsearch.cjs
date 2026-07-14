const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

// Replace the inline detailed view inside multiEntities.map with the Context Sheet Drawer.

// We need to keep the grid unchanged and just render the generic poster view.
// In SmartSearch, the rendering logic is:
// if (hasSelectedPoster) { return ( <div w-full ... detailed inline> ... ) }
// return ( <div aspect-[2/3] ... grid item> ... )
//
// Let's refactor the grid mapping to NEVER return the inline view.

code = code.replace(/if \(hasSelectedPoster\) \{[\s\S]*?\/\* Smart Nested Link Router[\s\S]*?<\/div>\n\s*\}\);\n\s*return \([\s\S]*?<\/div>\n\s*\);\n\s*\}\n\s*\/\/ Dynamic Grid View/g, '// Dynamic Grid View');

// Wait, the above regex is complex. Let's do it fundamentally.
// The map function looks like:
// {multiEntities.map((entity, idx) => {
//   if (hasSelectedPoster) {
//     return ( ... )
//   }
//   // Dynamic Grid View
//   return ( ... )
// })}

const mapStart = `{multiEntities.map((entity, idx) => {
                                if (hasSelectedPoster) {
`;

// It's probably easier to read it, manipulate the AST or just use exact string replacement.
// But I can also just find the `grid-cols-1` logic and remove it.

code = code.replace(/className=\{\`w-full grid \$\{\n\s*hasSelectedPoster\n\s*\? "grid-cols-1"\n\s*: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2"\n\s*\}\`\}/g,
  `className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2"`
);

// We need to replace the `if (hasSelectedPoster)` block. 
fs.writeFileSync('src/pages/SmartSearch.tsx', code);
