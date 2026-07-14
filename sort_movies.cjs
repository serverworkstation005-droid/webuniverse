const fs = require('fs');

const pathMovies = 'src/pages/Movies.tsx';
let movies = fs.readFileSync(pathMovies, 'utf8');

// We have MOVIE_PROVIDERS array. We can use eval or just parse it.
// Since it's standard TS/JS, we can parse it carefully.
// But it's easier to manipulate the file using a regex if we assume consistent formatting, or better yet, just write a targeted script.

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

// We want to pluck specific objects and move them behind DDLBase.
const targetNames = [
    'Pahe',
    'Movies Drives',
    'VegaMovies',
    'MoviesLeech',
    'Multi Shows',
    'Filmy Luxe',
    'CinemaLux',
    'HDMovieVerse',
    'SSR Movies',
    'India4Movies'
];

let items = {};
for (const name of targetNames) {
    const rx = new RegExp(`{\\s*name:\\s*['"]${name}['"]`);
    const match = rx.exec(movies);
    if (!match) {
        console.log("NOT FOUND: ", name);
        continue;
    }
    
    const objStr = extractObject(movies, match.index);
    items[name] = objStr;
    
    // Replace the found object with a marker to remove it, along with trailing commas
    let startRemove = match.index;
    let endRemove = startRemove + objStr.length;
    // Check for trailing comma
    while (movies[endRemove] === ',' || movies[endRemove] === ' ' || movies[endRemove] === '\n' || movies[endRemove] === '\r') {
        endRemove++;
    }
    movies = movies.substring(0, startRemove) + movies.substring(endRemove);
}

// Now find DDLBase and insert them after it
const ddlBaseMatch = /\{\s*name:\s*['"]DDLBase['"]/.exec(movies);
if (ddlBaseMatch) {
    const ddlBaseObj = extractObject(movies, ddlBaseMatch.index);
    const endIdx = ddlBaseMatch.index + ddlBaseObj.length;
    let insertIdx = endIdx;
    if (movies[insertIdx] === ',') insertIdx++;
    
    // Insert new items
    const insertion = '\\n  ' + targetNames.map(n => items[n]).filter(Boolean).join(',\\n  ') + ',';
    movies = movies.substring(0, insertIdx) + insertion + movies.substring(insertIdx);
} else {
    console.log("DDLBase not found");
}

// remove rogmovies
const rogReg = /\{\s*name:\s*['"]ROG Movies['"]/;
const rogMatch = rogReg.exec(movies);
if (rogMatch) {
    const rogObj = extractObject(movies, rogMatch.index);
    let startRemove = rogMatch.index;
    let endRemove = startRemove + rogObj.length;
    while (movies[endRemove] === ',' || movies[endRemove] === ' ' || movies[endRemove] === '\n' || movies[endRemove] === '\r') {
        endRemove++;
    }
    movies = movies.substring(0, startRemove) + movies.substring(endRemove);
}

fs.writeFileSync(pathMovies, movies);
console.log("Sorted Movies.tsx");
