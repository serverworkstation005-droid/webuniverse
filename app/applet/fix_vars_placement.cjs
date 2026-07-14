const fs = require('fs');
let code = fs.readFileSync('src/pages/SmartSearch.tsx', 'utf8');

// remove the existing ones
code = code.replace(/  const \[hasSelectedCategory, setHasSelectedCategory\] = useState<boolean>\(false\);\n/g, '');
code = code.replace(/  const \[debouncedQuery, setDebouncedQuery\] = useState\(""\);\n/g, '');

// insert it right underneath query
code = code.replace('const [query, setQuery] = useState("");', 'const [query, setQuery] = useState("");\n  const [hasSelectedCategory, setHasSelectedCategory] = useState<boolean>(false);\n  const [debouncedQuery, setDebouncedQuery] = useState("");');

fs.writeFileSync('src/pages/SmartSearch.tsx', code);
