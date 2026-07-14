const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetOnKeyDown = `            onKeyDown={async (e) => {
              if (e.key === "Enter" && query.trim().length >= 2) {
                e.preventDefault();
                saveToRecent(query);
                setShowSuggestions(false);
                setHasSelectedPoster(false);
                setActiveGroupTab(null);
                setHasSelectedCategory(false);
                setMultiEntities([]);
                setIsSearchExecuted(true);
                setHidePoster(false);
                setSelectedSubFilter("all"); // Reset filter
                lastSearchedQuery.current = query.trim();
                searchInputRef.current?.blur();
              }
            }}`;

const newOnKeyDown = `            onKeyDown={async (e) => {
              if (e.key === "Enter" && query.trim().length >= 2) {
                e.preventDefault();
                saveToRecent(query);
                setShowSuggestions(false);
                setHasSelectedPoster(false);
                setActiveGroupTab(null);
                setHasSelectedCategory(false);
                setMultiEntities([]);
                setIsSearchExecuted(true);
                setHidePoster(false);
                setSelectedSubFilter("all"); // Reset filter
                lastSearchedQuery.current = query.trim();
                searchInputRef.current?.blur();
                fetchExactPoster(query, "all");
              }
            }}`;

code = code.replace(targetOnKeyDown, newOnKeyDown);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
