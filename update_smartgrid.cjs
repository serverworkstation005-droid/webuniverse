const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetStr = `className={\`w-full \${
                                hasSelectedPoster
                                  ? "grid grid-cols-1"
                                  : "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 sm:gap-4 md:gap-5 px-2 [column-fill:_balance]"
                              }\`}`;

const replaceStr = `className={\`w-full grid \${
                                hasSelectedPoster
                                  ? "grid-cols-1"
                                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5 md:gap-6 px-2"
                              }\`}
                              style={{ gridAutoRows: 'minmax(min-content, max-content)' }}`;

code = code.replace(targetStr, replaceStr);

const targetBlock = `focusedPosterIndex === idx 
                                          ? 'border-2 border-indigo-400 scale-[1.03] ring-4 ring-indigo-500/20 z-20 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-slate-900' 
                                          : 'border border-white/5 bg-transparent hover:scale-[1.03] hover:z-20 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] hover:border-white/20'
                                  } break-inside-avoid mb-3 sm:mb-4 md:mb-5 h-auto max-h-min\`}`;

const replaceBlock = `focusedPosterIndex === idx 
                                          ? 'border-2 border-indigo-400 scale-[1.03] ring-4 ring-indigo-500/20 z-20 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-slate-900' 
                                          : 'border border-white/5 bg-transparent hover:scale-[1.03] hover:z-20 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] hover:border-white/20'
                                  } h-full min-h-[220px]\`}`;

code = code.replace(targetBlock, replaceBlock);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
