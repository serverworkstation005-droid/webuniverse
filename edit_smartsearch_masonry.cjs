const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetGrid = `className={\`w-full grid \${
                                hasSelectedPoster
                                  ? "grid-cols-1"
                                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 px-2"
                              }\`}`;

const replaceGrid = `className={\`w-full \${
                                hasSelectedPoster
                                  ? "grid grid-cols-1"
                                  : "columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-3 sm:gap-4 md:gap-5 px-2 [column-fill:_balance]"
                              }\`}`;

code = code.replace(targetGrid, replaceGrid);

const gridMapTarget = `                                      focusedPosterIndex === idx 
                                          ? 'border-2 border-indigo-400 scale-[1.03] ring-4 ring-indigo-500/20 z-20 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-slate-900' 
                                          : 'border border-white/5 bg-transparent hover:scale-[1.03] hover:z-20 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] hover:border-white/20'
                                  }\`}
                                >
                                  <SafeImage`;

const gridMapReplace = `                                      focusedPosterIndex === idx 
                                          ? 'border-2 border-indigo-400 scale-[1.03] ring-4 ring-indigo-500/20 z-20 shadow-[0_0_30px_rgba(99,102,241,0.5)] bg-slate-900' 
                                          : 'border border-white/5 bg-transparent hover:scale-[1.03] hover:z-20 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] hover:border-white/20'
                                  } break-inside-avoid mb-3 sm:mb-4 md:mb-5 h-auto max-h-min\`}
                                  style={{ aspectRatio: "2/3" }}
                                >
                                  <SafeImage`;

code = code.replace(gridMapTarget, gridMapReplace);

// We need to make sure to remove `aspect-[2/3]` since it's now inline Style or `aspect-[2/3] break-inside-avoid`. Actually `aspect-[2/3]` works.
code = code.replace(`className={\`w-full aspect-[2/3] relative overflow-hidden rounded-[20px] group cursor-pointer`, `className={\`w-full aspect-[2/3] block relative overflow-hidden rounded-[20px] group cursor-pointer`);

// And we need to remove the gap from the row heights if using columns because `mb-x` gives the margin.
fs.writeFileSync('src/pages/SmartSearch.tsx', code);
