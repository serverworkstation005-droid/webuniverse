const fs = require('fs');

let smartSearch = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetSortLogic = `            // Collection-aware Sorting Logic
            const sortWithCollections = (items: any[]) => {
               const getBaseTitle = (title: string) => {
                 const t = title.toLowerCase();
                 const parts = t.split(/[:\\-]/);
                 return parts[0].replace(/[0-9]+.*$/, '').trim();
               };
               
               const groupMaxDate: Record<string, number> = {};
               const wrapped = items.map(item => {
                   const base = getBaseTitle(item.title);
                   const date = item.release_date && item.release_date !== "Unknown" ? new Date(item.release_date).getTime() : 0;
                   if (!groupMaxDate[base] || date > groupMaxDate[base]) {
                       groupMaxDate[base] = date;
                   }
                   return { item, base, date };
               });
               
               return wrapped.sort((a, b) => {
                   if (a.base !== b.base) {
                       return groupMaxDate[b.base] - groupMaxDate[a.base]; // Latest group first
                   }
                   return a.date - b.date; // Chronological ascending within group
               }).map(w => w.item);
            };`;

const replaceSortLogic = `            // Collection-aware Sorting and Grouping Logic
            const sortWithCollections = (items: any[]) => {
               const getBaseTitle = (title: string) => {
                 const t = title.toLowerCase();
                 // handle parts 1
                 const parts1 = t.split(':');
                 const p1 = parts1[0].replace(/[0-9]+.*$/, '').trim();
                 return p1;
               };
               
               const groups: Record<string, any[]> = {};
               items.forEach(item => {
                   const base = getBaseTitle(item.title);
                   if (!groups[base]) groups[base] = [];
                   groups[base].push(item);
               });
               
               return Object.values(groups).map(group => {
                   group.sort((a,b) => {
                       const dA = a.release_date && a.release_date !== "Unknown" ? new Date(a.release_date).getTime() : 0;
                       const dB = b.release_date && b.release_date !== "Unknown" ? new Date(b.release_date).getTime() : 0;
                       return dB - dA;
                   });
                   const latest = group[0];
                   if (group.length > 1) {
                       let prettyTitle = getBaseTitle(latest.title);
                       prettyTitle = prettyTitle.replace(/\\b\\w/g, c => c.toUpperCase());
                       return { ...latest, title: \`\${prettyTitle} Collection\` };
                   }
                   return latest;
               }).sort((a, b) => {
                   const dA = a.release_date && a.release_date !== "Unknown" ? new Date(a.release_date).getTime() : 0;
                   const dB = b.release_date && b.release_date !== "Unknown" ? new Date(b.release_date).getTime() : 0;
                   return dB - dA;
               });
            };`;

// replace all instances
smartSearch = smartSearch.split(targetSortLogic).join(replaceSortLogic);

// Now for chunk 4: filter active bg
const targetFilter = `                          {staticGroups.map((g) => (
                            <motion.button
                              layout
                              key={g.id}
                              onClick={() => {
                                setMultiEntities([]);
                                setActiveGroupTab(g.id);
                                setHasSelectedCategory(true);
                                fetchExactPoster(query, g.id);
                              }}
                              className={\`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[11px] sm:text-[13px] tracking-wider transition-all duration-300 border backdrop-blur-2xl shadow-xl whitespace-nowrap shrink-0 hover:scale-[1.03] active:scale-95 group \${
                                isDark
                                  ? "bg-[#080812]/90 text-white/80 border-white/10 hover:text-white hover:bg-white/[0.08] hover:border-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                                  : "bg-white text-slate-800 border-slate-200 hover:shadow-md"
                              }\`}
                            >
                              {g.icon}
                              {g.tag}
                            </motion.button>
                          ))}`;

const replaceFilter = `                          {staticGroups.map((g) => (
                            <motion.button
                              layout
                              key={g.id}
                              onClick={() => {
                                setMultiEntities([]);
                                setActiveGroupTab(g.id);
                                setHasSelectedCategory(true);
                                fetchExactPoster(query, g.id);
                              }}
                              className={\`relative flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-[11px] sm:text-[13px] tracking-wider transition-all duration-300 border backdrop-blur-2xl shadow-xl whitespace-nowrap shrink-0 hover:scale-[1.03] active:scale-95 group \${
                                activeGroupTab === g.id ? (isDark ? "text-white" : "text-black") : (isDark ? "text-white/80 border-white/10 hover:text-white" : "text-slate-800 hover:text-black")
                              }\`}
                            >
                              {activeGroupTab === g.id && (
                                <motion.div
                                  layoutId="activeFilterBg"
                                  className={\`absolute inset-0 rounded-full \${isDark ? "bg-white/10 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.08)]" : "bg-slate-100 border-slate-200 shadow-sm"}\`}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                              )}
                              <span className="relative z-10">{g.icon}</span>
                              <span className="relative z-10">{g.tag}</span>
                            </motion.button>
                          ))}`;

smartSearch = smartSearch.replace(targetFilter, replaceFilter);

// AuraCursor.tsx fix
let auraCursor = fs.readFileSync('src/components/AuraCursor.tsx', 'utf8');
const targetAura = `        // Perform real-time velocity calculations for the fluid spring stretch
        const now = Date.now();
        const dt = now - prevCoords.current.time;
        if (dt > 10) {
          const dx = e.clientX - prevCoords.current.x;
          const dy = e.clientY - prevCoords.current.y;
          const distance = Math.hypot(dx, dy);
          
          // Calculate raw speed, then map it to a highly refined stretch threshold
          const speed = Math.min(distance / dt, 4); 
          mouseSpeed.set(speed);
          
          // Map velocity to dynamic scale stretch indicator (subtle scale change)
          speedScale.set(1 + speed * 0.06);

          prevCoords.current = { x: e.clientX, y: e.clientY, time: now };
        }`;

const replaceAura = `        prevCoords.current = { x: e.clientX, y: e.clientY, time: Date.now() };`;
auraCursor = auraCursor.replace(targetAura, replaceAura);

fs.writeFileSync('src/pages/SmartSearch.tsx', smartSearch);
fs.writeFileSync('src/components/AuraCursor.tsx', auraCursor);
console.log("Refactoring complete");
