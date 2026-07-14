const fs = require('fs');

const pathMovies = 'src/pages/Movies.tsx';
const pathSearch = 'src/data/searchResources.ts';
const pathSmart = 'src/pages/SmartSearch.tsx';
const pathGlobal = 'src/components/GlobalSearchModal.tsx';

function replaceDomains(content) {
  return content
    .replace(/4khdhub\.link/g, '4khdhub.one')
    .replace(/uhdmovies\.pink/g, 'uhdmovies.food')
    .replace(/uhdmovies\.rodeo/g, 'uhdmovies.food')
    .replace(/olamovies\.mov/g, 'v2.olamovies.mov') // Will make a.olamovies.mov into a.v2... wait
    .replace(/a\.olamovies\.mov/g, 'v2.olamovies.mov')
    .replace(/vegamovies\.market/g, 'vegamovies.mq')
    .replace(/new1\.hdhub4u\.limo/g, 'new1.hdhub4u.cl')
    .replace(/hdhub4u\.limo/g, 'new1.hdhub4u.cl')
    .replace(/downloadhub\.christmas/g, 'downloadhub.lat')
    .replace(/allmovieshub\.gripe/g, 'allmovieshub.gives')
    .replace(/allmovieshub\.agency/g, 'allmovieshub.gives')
    .replace(/india4movies\.my/g, 'go.india4movies.net');
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

console.log("Domains replaced.");
