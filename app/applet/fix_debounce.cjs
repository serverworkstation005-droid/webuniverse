const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

const debounceBlock = `  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleQueryChange = useCallback((val: string) => {
    setLocalQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    // Fast path for clearing search instantly
    if (val.trim().length === 0) {
      setQuery('');
      setMultiEntities([]);
      setIsSearchExecuted(false);
      setHasSelectedPoster(false);
      setHasSelectedCategory(false);
      return;
    }

    startTransition(() => {
      searchTimeoutRef.current = setTimeout(() => {
        setQuery(val);
      }, 150); // Apple-tier 150ms responsive threshold
    });
  }, []);`;

// Remove the old debouncedSetQuery
code = code.replace(/  const debouncedSetQuery = useMemo\([\s\S]*?\n  \);\n/g, debounceBlock);

// Replace onChange handler
code = code.replace(/onChange=\{\(e\) => \{\n\s*setLocalQuery\(e\.target\.value\);\n\s*debouncedSetQuery\(e\.target\.value\);\n\s*\}\}/g, `onChange={(e) => handleQueryChange(e.target.value)}`);

// Clear out old timer useEffect for debouncedQuery
code = code.replace(/  useEffect\(\(\) => \{\n\s*const timer = setTimeout\(\(\) => \{\n\s*setDebouncedQuery\(query\);\n\s*\}, 250\);\n\s*return \(\) => clearTimeout\(timer\);\n\s*\}, \[query\]\);\n/g, '');

// Clear out old debouncedQuery state
code = code.replace(/  const \[debouncedQuery, setDebouncedQuery\] = useState\(""\);\n/g, '');

// Update the if block that used debouncedQuery
code = code.replace(/  useEffect\(\(\) => \{\n\s*if \(debouncedQuery\.trim\(\)\.length === 0\) \{\n\s*setMultiEntities\(\[\]\);\n\s*setIsSearchExecuted\(false\);\n\s*setHasSelectedPoster\(false\);\n\s*setHasSelectedCategory\(false\);\n\s*\}\n\s*\}, \[debouncedQuery\]\);\n/g, '');


fs.writeFileSync('src/pages/SmartSearch.tsx', code);
