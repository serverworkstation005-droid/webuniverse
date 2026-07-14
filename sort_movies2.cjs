const fs = require('fs');

const pathMovies = 'src/pages/Movies.tsx';
let movies = fs.readFileSync(pathMovies, 'utf8');

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
    'HDMovieVerse',
    'SSR Movies',
    'India4Movies'
];

let items = {};
for (const name of namesToRemove) {
    const rx = new RegExp(`{\\s*name:\\s*['"]${name}['"]`);
    const match = rx.exec(movies);
    if (!match) {
        console.log("NOT FOUND: ", name);
        continue;
    }
    
    const objStr = extractObject(movies, match.index);
    items[name] = objStr;
    
    let startRemove = match.index;
    let endRemove = startRemove + objStr.length;
    while (movies[endRemove] === ',' || movies[endRemove] === ' ' || movies[endRemove] === '\n' || movies[endRemove] === '\r') {
        endRemove++;
    }
    movies = movies.substring(0, startRemove) + movies.substring(endRemove);
}

// Insert after CinemaLux
const cinemaluxNames = ['Private Moviez', 'XD Movies', 'MovieNest BD'];
const clMatch = /\{\s*name:\s*['"]CinemaLux['"]/.exec(movies);
if (clMatch) {
    const clObj = extractObject(movies, clMatch.index);
    const endIdx = clMatch.index + clObj.length;
    let insertIdx = endIdx;
    if (movies[insertIdx] === ',') insertIdx++;
    
    const insertion = '\n  ' + cinemaluxNames.map(n => items[n]).filter(Boolean).join(',\n  ') + ',';
    movies = movies.substring(0, insertIdx) + insertion + movies.substring(insertIdx);
} else {
    console.log("CinemaLux not found");
}

// Insert after KatMovieHD
const katNames = ['HDMovieVerse', 'SSR Movies', 'India4Movies'];
const katMatch = /\{\s*name:\s*['"]KatMovieHD['"]/.exec(movies);
if (katMatch) {
    const katObj = extractObject(movies, katMatch.index);
    const endIdx = katMatch.index + katObj.length;
    let insertIdx = endIdx;
    if (movies[insertIdx] === ',') insertIdx++;
    
    const insertion = '\n  ' + katNames.map(n => items[n]).filter(Boolean).join(',\n  ') + ',';
    movies = movies.substring(0, insertIdx) + insertion + movies.substring(insertIdx);
} else {
    console.log("KatMovieHD not found");
}

fs.writeFileSync(pathMovies, movies);
console.log("Sorted Movies.tsx part 2");
