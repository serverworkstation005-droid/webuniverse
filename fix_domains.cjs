const fs = require('fs');

const pathMovies = 'src/pages/Movies.tsx';
const pathSearch = 'src/data/searchResources.ts';
const pathSmart = 'src/pages/SmartSearch.tsx';
const pathGlobal = 'src/components/GlobalSearchModal.tsx';

function replaceDomains(content) {
  return content
    .replace(/a\.v2\.v2\.olamovies\.mov/g, 'v2.olamovies.mov')
    .replace(/a\.v2\.olamovies\.mov/g, 'v2.olamovies.mov')
    .replace(/v2\.v2\.olamovies\.mov/g, 'v2.olamovies.mov')
    .replace(/new1\.new1\.hdhub4u\.cl/g, 'new1.hdhub4u.cl')
    .replace(/go\.go\.india4movies\.net/g, 'go.india4movies.net');
}

let movies = fs.readFileSync(pathMovies, 'utf8');
movies = replaceDomains(movies);
fs.writeFileSync(pathMovies, movies);

let search = fs.readFileSync(pathSearch, 'utf8');
search = replaceDomains(search);
fs.writeFileSync(pathSearch, search);

let smart = fs.readFileSync(pathSmart, 'utf8');
smart = replaceDomains(smart);
fs.writeFileSync(pathSmart, smart);

let global = fs.readFileSync(pathGlobal, 'utf8');
global = replaceDomains(global);
fs.writeFileSync(pathGlobal, global);

console.log("Domains fixed.");
