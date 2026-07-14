const fs = require('fs');

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

function processFile(filePath, namesToMove, namesToRemove, targetName, moveBefore = true) {
    let content = fs.readFileSync(filePath, 'utf8');

    let items = {};

    // Remove targeted ones
    for (const name of namesToRemove) {
        const rx = new RegExp(`\\{\\s*name:\\s*['"]${name}['"]`);
        const match = rx.exec(content);
        if (match) {
            const objStr = extractObject(content, match.index);
            let startRemove = match.index;
            let endRemove = startRemove + objStr.length;
            while (content[endRemove] === ',' || content[endRemove] === ' ' || content[endRemove] === '\n' || content[endRemove] === '\r') {
                endRemove++;
            }
            content = content.substring(0, startRemove) + content.substring(endRemove);
        }
    }

    // Extract ones to move
    for (const name of namesToMove) {
        const rx = new RegExp(`\\{\\s*name:\\s*['"]${name}['"]`);
        const match = rx.exec(content);
        if (match) {
            const objStr = extractObject(content, match.index);
            items[name] = objStr;
            let startRemove = match.index;
            let endRemove = startRemove + objStr.length;
            while (content[endRemove] === ',' || content[endRemove] === ' ' || content[endRemove] === '\n' || content[endRemove] === '\r') {
                endRemove++;
            }
            content = content.substring(0, startRemove) + content.substring(endRemove);
        } else {
            console.log(`Warning: ${name} not found in ${filePath}`);
        }
    }

    // Insert them
    const targetRx = new RegExp(`\\{\\s*name:\\s*['"]${targetName}['"]`);
    const targetMatch = targetRx.exec(content);
    if (targetMatch) {
        const targetObj = extractObject(content, targetMatch.index);
        let insertIdx = moveBefore ? targetMatch.index : targetMatch.index + targetObj.length;
        if (!moveBefore && content[insertIdx] === ',') insertIdx++;

        const objectsToInsert = namesToMove.map(n => items[n]).filter(Boolean).join(',\n  ');
        if (objectsToInsert.length > 0) {
            const insertion = (moveBefore ? '' : '\n  ') + objectsToInsert + ',\n  ';
            content = content.substring(0, insertIdx) + insertion + content.substring(insertIdx);
        }
    } else {
        console.log(`Target ${targetName} not found in ${filePath}`);
    }

    fs.writeFileSync(filePath, content);
}

// Movies.tsx
processFile(
    'src/pages/Movies.tsx',
    ['FreeDriveMovie', 'Fojik', 'Movie Drive BD', 'MovieBaaz'],
    ['AZMovies'],
    'Movie Dokan',
    true // before
);

// searchResources.ts
processFile(
    'src/data/searchResources.ts',
    ['Freedrivemovie', 'Fojik', 'Movie Drive BD', 'Moviebaaz'],
    ['AZMovies'], // no harm if not found
    'Movie Dokan',
    true // before
);
