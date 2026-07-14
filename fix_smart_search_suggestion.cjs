const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetSelect = `  const selectSuggestion = (item: SuggestionItem) => {
    setMultiEntities([item]);
    setHasSelectedPoster(false);
    setActiveGroupTab(null);
    setHasSelectedCategory(false);
    setQuery(item.title);
    saveToRecent(item.title);
    setShowSuggestions(false);
    setHidePoster(false);
    setIsSearchExecuted(true);
    setSelectedSubFilter("all");
    lastSearchedQuery.current = item.title;
    searchInputRef.current?.blur();
  };`;

const newSelect = `  const selectSuggestion = (item: SuggestionItem) => {
    setMultiEntities([]); // Clear first so new UI mounts properly
    setHasSelectedPoster(false);
    setActiveGroupTab(null);
    setHasSelectedCategory(false);
    setQuery(item.title);
    saveToRecent(item.title);
    setShowSuggestions(false);
    setHidePoster(false);
    setIsSearchExecuted(true);
    setSelectedSubFilter("all");
    lastSearchedQuery.current = item.title;
    searchInputRef.current?.blur();
    fetchExactPoster(item.title, "all");
  };`;

// Note: I also changed setMultiEntities([item]) to setMultiEntities([]) because fetchExactPoster handles it and we want the same unified flow.

code = code.replace(targetSelect, newSelect);
fs.writeFileSync('src/pages/SmartSearch.tsx', code);
