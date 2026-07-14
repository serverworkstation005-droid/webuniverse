const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const startIdx = code.indexOf('if (hasSelectedPoster) {');
const endIdx = code.indexOf('// Dynamic Grid View');

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
}

// Ensure the drawer renders when hasSelectedPoster is true.
// The selected entity is `multiEntities[focusedPosterIndex]` (wait, focusedPosterIndex is -1 when clicked).
// Let's modify the click handler for the poster grid items!
// Instead of modifying activeCategory, it should just select the entity.
// In the grid item click handler:
const oldOnClick = `onClick={() => {
                                    const catId =
                                      entity.type === "movie"
                                        ? "movies"
                                        : entity.type === "software"
                                          ? "software"
                                          : entity.type === "anime"
                                            ? "anime"
                                            : "games";
                                    setActiveCategory(catId);
                                    setIsManualCategory(true);
                                    setMultiEntities([entity]);
                                    setHasSelectedPoster(true);
                                    setFocusedPosterIndex(-1);
                                    searchInputRef.current?.blur();
                                  }}`;

const newOnClick = `onClick={(e) => {
                                    e.preventDefault();
                                    setHasSelectedPoster(true);
                                    // Make sure we keep the current entities, just select this one.
                                    // Actually, we can use a new state or just depend on focusedPosterIndex.
                                    setFocusedPosterIndex(idx);
                                    searchInputRef.current?.blur();
                                  }}`;

code = code.replace(oldOnClick, newOnClick);

const oldEnterKey = `if (e.key === "Enter" && focusedPosterIndex >= 0) {
                        e.preventDefault();
                        const entity = multiEntities[focusedPosterIndex];
                        const catId =
                          entity.type === "movie"
                            ? "movies"
                            : entity.type === "software"
                              ? "software"
                              : entity.type === "anime"
                                ? "anime"
                                : "games";
                        setActiveCategory(catId);
                        setIsManualCategory(true);
                        setMultiEntities([entity]);
                        setHasSelectedPoster(true);
                        setFocusedPosterIndex(-1);
                        searchInputRef.current?.blur();
                      }`;

const newEnterKey = `if (e.key === "Enter" && focusedPosterIndex >= 0) {
                        e.preventDefault();
                        setHasSelectedPoster(true);
                        searchInputRef.current?.blur();
                      }`;

code = code.replace(oldEnterKey, newEnterKey);

// Add the Context Sheet at the end of the return
const contextSheet = `
      {/* Premium Multi-Dimensional Context Sheet */}
      <AnimatePresence>
        {hasSelectedPoster && multiEntities[focusedPosterIndex] && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md cursor-pointer"
              onClick={() => {
                 setHasSelectedPoster(false);
                 setFocusedPosterIndex(-1);
              }}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y > 100) {
                    setHasSelectedPoster(false);
                    setFocusedPosterIndex(-1);
                }
              }}
              className="fixed bottom-0 left-0 right-0 z-[101] bg-[#0a0a0f]/90 border-t border-white/10 backdrop-blur-[40px] rounded-t-[40px] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-10 max-h-[90vh] overflow-y-auto will-change-transform translate-z-0 overscroll-none"
            >
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-8 cursor-grab active:cursor-grabbing" />
              
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start max-w-4xl mx-auto">
                <div className="w-32 h-48 sm:w-40 sm:h-60 shrink-0 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden bg-white/5">
                  <SafeImage src={multiEntities[focusedPosterIndex].poster_path} alt={multiEntities[focusedPosterIndex].title} type={multiEntities[focusedPosterIndex].type} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left h-full">
                  <div className="flex flex-wrap gap-2 mb-3 justify-center sm:justify-start">
                    <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 text-white/70 border border-white/10">
                      {multiEntities[focusedPosterIndex].type === "movie" ? "Movies & Shows" : multiEntities[focusedPosterIndex].type === "game" ? "Video Game" : multiEntities[focusedPosterIndex].type === "software" ? "Software" : "Anime"}
                    </span>
                    {multiEntities[focusedPosterIndex].release_date && multiEntities[focusedPosterIndex].release_date !== "Unknown" && (
                        <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-white/10 text-white/70 border border-white/10">
                          {multiEntities[focusedPosterIndex].release_date.substring(0, 4)}
                        </span>
                    )}
                  </div>
                  
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tighter text-white mb-2">{multiEntities[focusedPosterIndex].title}</h2>
                  <p className="text-sm sm:text-base text-white/50 font-mono mb-6 max-w-xl leading-relaxed">{multiEntities[focusedPosterIndex].overview || "No extended overview exists for this query."}</p>
                  
                  {/* Premium Quality Links / Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full mt-auto">
                    {/* Launch or View buttons */}
                    {(multiEntities[focusedPosterIndex].type === 'movie' || multiEntities[focusedPosterIndex].type === 'anime') && (
                        <>
                            <a href="#" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-white text-black hover:bg-slate-200 transition-colors active:scale-[0.98]">
                            4K UHD
                            <ExternalLink size={16} />
                            </a>
                            <a href="#" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors active:scale-[0.98]">
                            1080p
                            </a>
                        </>
                    )}
                    <a href="#" className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors active:scale-[0.98]">
                      TORRENT
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
`;

let lastReturnIndex = code.lastIndexOf('</div>');
if (lastReturnIndex !== -1) {
  let outerLastIndex = code.lastIndexOf('</div>', lastReturnIndex - 1);
  if (outerLastIndex !== -1) {
     code = code.substring(0, outerLastIndex) + contextSheet + "\n" + code.substring(outerLastIndex);
  }
}

// Ensure style is clean
code = code.replace(/className=\{\`w-full grid \$\{\n\s*hasSelectedPoster\n\s*\? "grid-cols-1"\n\s*: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2"\n\s*\}\`\}/g,
  `className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-2"`
);

// We should also ensure the escape key works to close the drawer.
// It is already linked to search clearing, we should update Escape handler.
// Search for Escape
code = code.replace(/if \(e\.key === "Escape"\) \{\n\s*setMultiEntities\(\[\]\);\n\s*setHasSelectedPoster\(false\);\n\s*setHasSelectedCategory\(false\);\n\s*setIsSearchExecuted\(false\);\n\s*setTimeout\(\(\) => \{\n\s*searchInputRef\.current\?\.blur\(\);\n\s*\}, 50\);\n\s*\}/g,
 `if (e.key === "Escape") {
    if (hasSelectedPoster) {
       setHasSelectedPoster(false);
       setFocusedPosterIndex(-1);
    } else {
       setQuery('');
       setMultiEntities([]);
       setIsSearchExecuted(false);
       setHasSelectedCategory(false);
       setTimeout(() => { searchInputRef.current?.blur(); }, 50);
    }
  }`
);


fs.writeFileSync('src/pages/SmartSearch.tsx', code);
