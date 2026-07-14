import * as fs from "fs";

const file = fs.readFileSync("src/pages/Movies.tsx", "utf8");

const prefix = file.slice(0, file.indexOf("export const MOVIE_PROVIDERS = ["));
const suffixIdx = file.indexOf("];\n\nexport default function Movies");
const arrayStr = file.slice(file.indexOf("export const MOVIE_PROVIDERS = [") + "export const MOVIE_PROVIDERS = [".length, suffixIdx);
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

const order = [
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
    const match = p.match(/domain:\s*'([^']+)'/);
    return match ? match[1] : "";
};

const uniqueProvidersMap = new Map();
providers.forEach(p => {
    const domain = getDomain(p);
    if (!uniqueProvidersMap.has(domain)) {
        uniqueProvidersMap.set(domain, p);
    } else {
        const existing = uniqueProvidersMap.get(domain);
        if (p.includes("logo: '/logos/") && !existing.includes("logo: '/logos/")) {
            uniqueProvidersMap.set(domain, p);
        }
    }
});

const uniqueProviders = Array.from(uniqueProvidersMap.values());

const sorted = [];
order.forEach(domain => {
    const p = uniqueProviders.find(p => getDomain(p) === domain);
    if (p) {
        sorted.push(p);
    }
});

uniqueProviders.forEach(p => {
    const domain = getDomain(p);
    if (!order.includes(domain)) {
        sorted.push(p);
    }
});

const newFile = prefix + "export const MOVIE_PROVIDERS = [\n  " + sorted.join(",\n  ") + "\n" + suffix;
fs.writeFileSync("src/pages/Movies.tsx", newFile);
console.log("Done");
