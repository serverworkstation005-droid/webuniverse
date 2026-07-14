const fs = require('fs');

let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

// 1. Add debounce utility implementation at the top scope
const importsLine = `import { useState, useEffect, useRef, useMemo, useCallback } from "react";`;
let newImportsLine = importsLine;
if (!code.includes(`export function debounce(`)) {
  const debounceUtility = `
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
`;
  code = code.replace(importsLine, importsLine + "\\n" + debounceUtility);
}

// 2. Add local state to SmartSearch and setup debounced setter
const [queryLine, ...rest] = code.split(/  const \[query, setQuery\] = useState\(\"\"\);/);
if (rest.length > 0) {
  const insertState = `  const [query, setQuery] = useState("");
  const [localQuery, setLocalQuery] = useState("");
  
  const debouncedSetQuery = useMemo(
    () => debounce((val: string) => setQuery(val), 300),
    []
  );
  
  useEffect(() => {
    setLocalQuery(query);
  }, [query]);`;
  
  code = queryLine + insertState + rest.join('  const [query, setQuery] = useState("");');
}

// 3. Update onChange to use localQuery and debouncedSetQuery
const targetInput = `            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}`;

const replaceInput = `            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              debouncedSetQuery(e.target.value);
            }}`;

code = code.replace(targetInput, replaceInput);

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
