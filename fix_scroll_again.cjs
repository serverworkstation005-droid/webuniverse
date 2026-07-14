const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const scrollLockEffect = `  // --- SCROLL LOCK: Search & Filter Stages ---
  // Lock scroll when search input is focused OR when in the Filter-First selection stage (has results but no category finalized)
  useEffect(() => {
    // Determine if we need to lock scroll
    const shouldLockScroll = isInputFocused || (!hasSelectedCategory && isSearchExecuted && multiEntities.length > 0 && query.trim().length > 0);
    
    // We target a specific container to scroll lock gracefully, but body is required
    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isInputFocused, hasSelectedCategory, isSearchExecuted, multiEntities.length, query]);`;

code = code.replace(scrollLockEffect, "");

// put it before the useEffect for query debouncing so all state vars are available
const insertLine = `  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);`;

code = code.replace(insertLine, scrollLockEffect + "\n\n" + insertLine);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
