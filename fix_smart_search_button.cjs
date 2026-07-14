const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetButton = `            <button
              onClick={async () => {
                if (query.trim().length >= 2) {
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

const newButton = `            <button
              onClick={async () => {
                if (query.trim().length >= 2) {
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

if (code.includes(targetButton)) {
  code = code.replace(targetButton, newButton);
  fs.writeFileSync('src/pages/SmartSearch.tsx', code);
}
