import fs from 'fs';

const items = `
  {
    name: 'WorldOfPCGames',
    domain: 'worldofpcgames.com',
    description: 'Global library of full-version titles for your PC',
    url: 'https://worldofpcgames.com/',
    tags: ['Global', 'PC'],
    type: 'Download',
    logo: '/logos/World of PC Games.png'
  },
  {
    name: 'GOG-Games',
    domain: 'gogunlocked.com',
    description: 'DRM-free library of original and verified GOG games',
    url: 'https://gogunlocked.com/',
    tags: ['DRM-Free', 'GOG'],
    type: 'Download',
    logo: '/logos/gogunlocked.png'
  },
  {
    name: 'SteamUnlocked',
    domain: 'steamunlocked.org',
    description: 'Download pre-installed Steam games with one click',
    url: 'https://steamunlocked.org/',
    tags: ['Steam', 'Pre-installed'],
    type: 'Download',
    logo: '/logos/SteamUnlocked.png'
  },
  {
    name: 'SteamRip',
    domain: 'steamrip.com',
    description: 'Download pre-installed Steam games at high speed',
    url: 'https://steamrip.com/',
    tags: ['Premium', 'Pre-installed'],
    type: 'Download',
    logo: '/logos/steamrip.png'
  },
  {
    name: 'Steamora',
    domain: 'steamora.net',
    description: 'Premium repository for games and gaming tools',
    url: 'https://steamora.net/',
    tags: ['Games', 'Premium'],
    type: 'Download',
    logo: 'https://www.google.com/s2/favicons?domain=steamora.net&sz=128'
  },
  {
    name: 'SteamGG',
    domain: 'steamgg.net',
    description: 'Massive archive of pre-installed Steam games',
    url: 'https://steamgg.net/',
    tags: ['Pre-installed', 'PC'],
    type: 'Download',
    logo: '/logos/steamgg.png'
  },
  {
    name: 'GamesLeech',
    domain: 'gamesleech.com',
    description: 'Fast mirror links for downloading PC games',
    url: 'https://gamesleech.com/',
    tags: ['Index', 'Speed'],
    type: 'Download',
    logo: '/logos/gamesleech.png'
  },
  {
    name: 'OvaGames',
    domain: 'ovagames.com',
    description: 'Reliable source for highly compressed PC game rips',
    url: 'https://www.ovagames.com/',
    tags: ['PC', 'Compressed'],
    type: 'Download',
    logo: '/logos/ovagames.png'
  },
  {
    name: '4FNet',
    domain: 'www.4fnet.org',
    description: 'Comprehensive network for gaming resources',
    url: 'https://www.4fnet.org/',
    tags: ['Games', 'Resources'],
    type: 'Archive',
    logo: 'https://www.google.com/s2/favicons?domain=www.4fnet.org&sz=128'
  },
  {
    name: 'Repack-Games',
    domain: 'repack-games.com',
    description: 'Best destination for high-quality fast-install repacks',
    url: 'https://repack-games.com/',
    tags: ['Repacks', 'Premium'],
    type: 'Download',
    logo: '/logos/repack-games.com.png'
  },
  {
    name: 'Elamigos',
    domain: 'elamigos.site',
    description: 'High-quality game releases with multi-language support',
    url: 'https://elamigos.site/',
    tags: ['Releases', 'Global'],
    type: 'Download',
    logo: 'https://www.google.com/s2/favicons?domain=elamigos.site&sz=128'
  },
  {
    name: 'Dodi Repacks',
    domain: 'dodi-repacks.download',
    description: 'Modern game repacks optimized for fast installation',
    url: 'https://dodi-repacks.download/',
    tags: ['Fast', 'Repack'],
    type: 'Download',
    logo: '/logos/dodi-repacks.download.png'
  },
  {
    name: 'FitGirl Repacks',
    domain: 'fitgirl-repacks.site',
    description: "The world's most trusted ultra-compressed game repacks",
    url: 'https://fitgirl-repacks.site/',
    tags: ['Compressed', 'Trusted'],
    type: 'Download',
    logo: '/logos/fitgirl-repacks.png'
  },
  {
    name: 'IGG-Games',
    domain: 'igg-games.com',
    description: 'Large collection of PC games with daily new updates',
    url: 'https://igg-games.com/',
    tags: ['Updates', 'Massive'],
    type: 'Download',
    logo: '/logos/igggames.png'
  },`;

let content = fs.readFileSync('src/pages/Games.tsx', 'utf8');
content = content.replace(
  /{\s*name:\s*'Ocean of Games',/,
  items + "\n  {\n    name: 'Ocean of Games',"
);

fs.writeFileSync('src/pages/Games.tsx', content);

