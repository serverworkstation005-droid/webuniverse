const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const targetOnResult = `      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setQuery(resultText);
          setShowSuggestions(true);
        }
      };`;

const newOnResult = `      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        if (resultText) {
          setQuery(resultText);
          setShowSuggestions(false);
          setHasSelectedPoster(false);
          setActiveGroupTab(null);
          setHasSelectedCategory(false);
          setMultiEntities([]);
          setIsSearchExecuted(true);
          setHidePoster(false);
          setSelectedSubFilter("all");
          lastSearchedQuery.current = resultText;
          fetchExactPoster(resultText, "all");
        }
      };`;

code = code.replace(targetOnResult, newOnResult);
fs.writeFileSync('src/pages/SmartSearch.tsx', code);
