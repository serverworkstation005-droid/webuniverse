const fs = require('fs');

function refactorSearch() {
  const content = fs.readFileSync('/src/pages/SmartSearch.tsx', 'utf-8');
  let newContent = content;

  // 1. Remove the body overflow tracking logic completely. "scroll feature baad dao"
  newContent = newContent.replace(/\/\/ --- SCROLL LOCK: Search & Filter Stages ---[\s\S]*?document\.body\.style\.overflow = "";\s*};\s*\}, \[isInputFocused, hasSelectedCategory, isSearchExecuted, multiEntities\.length, query\]\);/g, '');

  // 2. Refactor handleQueryChange so it doesn't nuke the posters when cleared.
  newContent = newContent.replace(
    /if \(val\.trim\(\)\.length === 0\) \{\s*setQuery\(''\);\s*setMultiEntities\(\[\]\);\s*setIsSearchExecuted\(false\);\s*setHasSelectedPoster\(false\);\s*setHasSelectedCategory\(false\);\s*return;\s*\}/,
    `if (val.trim().length === 0) {
      setQuery('');
      // Do NOT clear multiEntities here to prevent the page from resetting to the top!
      return;
    }`
  );

  // 3. Make the floating morphing search bar.
  // We locate the searchBarNode block and wrap it in morphing logic.
  // Actually, we can just replace {searchBarNode} directly in the JSX.
  const searchBarNodePlacement = /\{searchBarNode\}/g;
  const replacement = `
             <AnimatePresence mode="wait">
               {isScrolled && !isInputFocused && query.trim().length === 0 ? (
                 <motion.div 
                   key="floating-icon"
                   layoutId="search-bar-morph"
                   initial={{ opacity: 0, scale: 0.8, y: -10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8, y: -10 }}
                   onClick={() => {
                     searchInputRef.current?.focus();
                   }}
                   style={{ willChange: 'transform, opacity' }}
                   className="mx-auto w-12 h-12 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center cursor-pointer shadow-lg bg-black/50"
                 >
                   <Search className="text-white/80 w-5 h-5" />
                 </motion.div>
               ) : (
                 <motion.div 
                   key="full-search"
                   layoutId="search-bar-morph" 
                   style={{ willChange: 'transform, opacity' }}
                   className="w-full"
                 >
                   {searchBarNode}
                 </motion.div>
               )}
             </AnimatePresence>
  `;
  newContent = newContent.replace(/\{searchBarNode\}/, replacement);

  // 4. In the filter staticGroups render block:
  // Add condition `(!isScrolled || isInputFocused)` to hide filters on scroll unless clicked
  const filterBlockRegex = /\{query\.trim\(\)\.length > 0 && !hidePoster && isSearchExecuted && !hasSelectedPoster && staticGroups\.length > 0 && \(/;
  newContent = newContent.replace(filterBlockRegex, 
    `{query.trim().length > 0 && !hidePoster && isSearchExecuted && !hasSelectedPoster && staticGroups.length > 0 && (!isScrolled || isInputFocused) && (`);

  // Write changes
  fs.writeFileSync('/src/pages/SmartSearch.tsx', newContent);
  console.log("Refactored SmartSearch.tsx");
}

refactorSearch();
