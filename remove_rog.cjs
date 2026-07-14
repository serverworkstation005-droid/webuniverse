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

const rogReg = /\{\s*name:\s*['"]ROG Movies['"]/;
const rogMatch = rogReg.exec(search);
if (rogMatch) {
    const rogObj = extractObject(search, rogMatch.index);
    let startRemove = rogMatch.index;
    let endRemove = startRemove + rogObj.length;
    while (search[endRemove] === ',' || search[endRemove] === ' ' || search[endRemove] === '\n' || search[endRemove] === '\r') {
        endRemove++;
    }
    search = search.substring(0, startRemove) + search.substring(endRemove);
}

fs.writeFileSync(pathSearch, search);
console.log("Removed ROG Movies from searchResources.ts");
