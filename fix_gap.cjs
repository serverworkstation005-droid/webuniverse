const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetStr = `className={\`w-full grid \${
                                hasSelectedPoster
                                  ? "grid-cols-1"
                                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 px-2"
                              }\`}
                              style={{ gridAutoRows: 'minmax(min-content, max-content)' }}`;

const replaceStr = `className={\`w-full grid \${
                                hasSelectedPoster
                                  ? "grid-cols-1"
                                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2"
                              }\`}
                              style={{ gridAutoRows: 'minmax(min-content, max-content)' }}`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
