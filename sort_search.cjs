const fs = require('fs');

const pathSearch = 'src/data/searchResources.ts';
let search = fs.readFileSync(pathSearch, 'utf8');

const extractObject = (text, startIdx) => {
    let braceCount = 0;
    let endIdx = -1;
    for (let i = startIdx; i < text.length; i++) {
        if (text[i] === '{') braceCount++;
        else if (text[i] === '}') braceCount--;
        
        if (braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    return text.substring(startIdx, endIdx + 1);
};

const namesToRemove = [
    'Private Moviez',
    'XD Movies',
    'MovieNest BD',
    'HDmovieverse',
    'SSR Movies',
    'India4Movies'
];

let items = {};
for (const name of namesToRemove) {
    const rx = new RegExp(`{\\s*name:\\s*['"]${name}['"]`);
    const match = rx.exec(search);
    if (!match) {
        console.log("NOT FOUND: ", name);
        continue;
    }
    
    const objStr = extractObject(search, match.index);
    items[name] = objStr;
    
    let startRemove = match.index;
    let endRemove = startRemove + objStr.length;
    while (search[endRemove] === ',' || search[endRemove] === ' ' || search[endRemove] === '\n' || search[endRemove] === '\r') {
        endRemove++;
    }
    search = search.substring(0, startRemove) + search.substring(endRemove);
}

// Insert after CinemaLux
const cinemaluxNames = ['Private Moviez', 'XD Movies', 'MovieNest BD'];
const clMatch = /\{\s*name:\s*['"]CinemaLux['"]/.exec(search);
if (clMatch) {
    const clObj = extractObject(search, clMatch.index);
    const endIdx = clMatch.index + clObj.length;
    let insertIdx = endIdx;
    if (search[insertIdx] === ',') insertIdx++;
    
    const insertion = '\n  ' + cinemaluxNames.map(n => items[n]).filter(Boolean).join(',\n  ') + ',';
    search = search.substring(0, insertIdx) + insertion + search.substring(insertIdx);
} else {
    console.log("CinemaLux not found");
}

// Insert after KatmovieHD
const katNames = ['HDmovieverse', 'SSR Movies', 'India4Movies'];
const katMatch = /\{\s*name:\s*['"]KatmovieHD['"]/.exec(search);
if (katMatch) {
    const katObj = extractObject(search, katMatch.index);
    const endIdx = katMatch.index + katObj.length;
    let insertIdx = endIdx;
    if (search[insertIdx] === ',') insertIdx++;
    
    const insertion = '\n  ' + katNames.map(n => items[n]).filter(Boolean).join(',\n  ') + ',';
    search = search.substring(0, insertIdx) + insertion + search.substring(insertIdx);
} else {
    console.log("KatmovieHD not found");
}

fs.writeFileSync(pathSearch, search);
console.log("Sorted searchResources.ts");
