import fs from 'fs';
const content = fs.readFileSync('src/data/searchResources.ts', 'utf8');

const newProviders = `
  {
    name: "World4ufree",
    domain: "world4ufree.wiki",
    description: "Popular platform for dubbed movies and direct downloads.",
    category: "movies",
    rating: 4.8,
    tier: "Tier-1 (Elite)",
    tags: ["Movies", "Dubbed", "Direct Download"],
    url: "https://world4ufree.wiki/",
    getSearchUrl: (q) => \`https://world4ufree.wiki/?s=\${encodeURIComponent(q)}\`
  },
  {
    name: "TheNextPlanet",
    domain: "thenextplanet.net",
    description: "Hub for various multi-language dubbed content.",
    category: "movies",
    rating: 4.7,
    tier: "Tier-2 (Excellent)",
    tags: ["Movies", "Dubbed", "Multilingual"],
    url: "https://thenextplanet.net/",
    getSearchUrl: (q) => \`https://thenextplanet.net/?s=\${encodeURIComponent(q)}\`
  }
`;

const updatedContent = content.replace(/];$/, newProviders + '];');
fs.writeFileSync('src/data/searchResources.ts', updatedContent);
