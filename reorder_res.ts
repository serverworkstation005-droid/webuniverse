import * as fs from "fs";

const file = fs.readFileSync("src/data/searchResources.ts", "utf8");

const prefix = file.slice(0, file.indexOf("export const searchResources: SearchProvider[] = ["));
const arrayStrStartIdx = file.indexOf("export const searchResources: SearchProvider[] = [") + "export const searchResources: SearchProvider[] = [".length;
const suffixIdx = file.lastIndexOf("];");
const arrayStr = file.slice(arrayStrStartIdx, suffixIdx);
const suffix = file.slice(suffixIdx);

const providers = [];
let braceCount = 0;
let current = "";

for (let i = 0; i < arrayStr.length; i++) {
    const char = arrayStr[i];
    if (char === "{") {
        braceCount++;
    }
    if (braceCount > 0) {
        current += char;
    }
    if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
            providers.push(current);
            current = "";
        }
    }
}

const moviesOrder = [
  "4khdhub.one",
  "uhdmovies.food",
  "new3.moviesdrives.my",
  "vegamovies.mq",
  "kmmovies.lol",
  "multishows.top",
  "katmoviehd.cymru",
  "top.xdmovies.wtf",
  "new.cloudmoviez.shop",
  "tamiltvtoons.site",
  "movienestbd.pics",
  "v2.olamovies.mov",
  "ddlbase.com",
  "zinkmovies.today",
  "cinemalux.wiki",
  "cinefreak.nl",

  "mlsbd.co",
  "joya9tv1.com",
  "cinedoze.tv",
  "southfreak.ink",
  "moviebaaz.cfd",
  "moviedokan.co",
  "moviedrivebd.com",
  "freedrivemovie.cfd",

  "fojik.site",
  "newhdmovie2.top",
  "mlfbd.best",
  "new.bollyflix.gd",
  "a.privatemoviez.surf",
  "new1.hdhub4u.cl",
  "go.india4movies.net",
  "ssrmovies.taxi",
  "downloadhub.lat",
  "moviesleech.link",
  "moviesmod.farm",
  "hdmovieverse.xyz",
  "1tamilmv.futbol",
  "allmovieshub.gives",
  "world4ufree.tw",
  "www.thenextplanet.living",
  "mkvbase.site",
  "moviedbhub.com"
];

const getDomain = (p) => {
    const match = p.match(/domain:\s*["']([^"']+)["']/);
    return match ? match[1] : "";
};

const isMovie = (p) => {
    return p.includes("category: \"movies\"");
};

const getCategory = (p) => {
    const match = p.match(/category:\s*["']([^"']+)["']/);
    return match ? match[1] : "";
};

const otherProviders = providers.filter(p => !isMovie(p));
const movieProviders = providers.filter(p => isMovie(p));

const sortedMovies = [];
moviesOrder.forEach(domain => {
    const p = movieProviders.find(p => getDomain(p) === domain);
    if (p) {
        sortedMovies.push(p);
    }
});

movieProviders.forEach(p => {
    const domain = getDomain(p);
    if (!moviesOrder.includes(domain)) {
        sortedMovies.push(p);
    }
});

const newProviders = [...sortedMovies, ...otherProviders];
const newFile = prefix + "export const searchResources: SearchProvider[] = [\n  " + newProviders.join(",\n  ") + "\n" + suffix;
fs.writeFileSync("src/data/searchResources.ts", newFile);
console.log("Done");
