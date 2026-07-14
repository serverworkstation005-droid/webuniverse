const fs = require('fs');

let code = fs.readFileSync('src/components/DirectoryLayout.tsx', 'utf8');

const targetGrid = `              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 w-full mt-4"
                style={{ gridAutoRows: 'minmax(min-content, max-content)' }}
              >`;

const replaceGrid = `              <div 
                className="columns-2 sm:columns-3 md:columns-4 lg:columns-6 xl:columns-7 gap-6 w-full mt-4 [column-fill:_balance]"
              >`;

code = code.replace(targetGrid, replaceGrid);

// Update portal item styling to work inside columns
const targetItem = `          className="block transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] will-change-transform ease-out h-full"`;
const replaceItem = `          className="block transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.98] will-change-transform ease-out break-inside-avoid mb-6"`;

code = code.split(targetItem).join(replaceItem);
fs.writeFileSync('src/components/DirectoryLayout.tsx', code);
