const fs = require('fs');

const pathMovies = 'src/pages/Movies.tsx';
let movies = fs.readFileSync(pathMovies, 'utf8');

movies = movies.replace(/\\n/g, '\n');

fs.writeFileSync(pathMovies, movies);
console.log("Fixed new lines.");
