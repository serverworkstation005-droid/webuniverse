const fs = require('fs');

const mappings = {
  '4K HD Hub': 'https://4khdhub.one/images/4KHDHUB-Bright-Logo.png',
  'UHD Movies': 'https://uhdmovies.food/wp-content/uploads/2021/03/uhdmovieslogonew.png',
  'DDLBase': 'https://i0.wp.com/i.postimg.cc/SQH79wgy/668271557-yyskgnc.png',
  'SouthFreak': 'https://southfreak.fyi/wp-content/uploads/2018/11/7.png',
  'India4Movies': 'https://image.india4movies.net/?img=https%3A%2F%2Fgo.india4movies.net%2Fwp-content%2Fuploads%2F2026%2F05%2FIndia4Movieslogo-e1779953069775.png',
  'MovieDBHub': 'https://moviedbhub.com/templates/hdmoviehub/images/logo.png',
  '1TamilMV': 'https://www.1tamilmv.cards/uploads/monthly_2026_04/logo.png.a2fe3a46dd23c8b4b3798642925294b9.png',
  'BollyFlix': 'https://bollyflixcdn.site/wp-content/uploads/2023/05/Bollyflix-movies.png',
  'HDMovieVerse': 'https://hdmovieverse.xyz/wp-content/uploads/moviesverse-202222.webp',
  'HDmovieverse': 'https://hdmovieverse.xyz/wp-content/uploads/moviesverse-202222.webp',
  'Fojik': 'https://fojik.com/wp-content/uploads/logo.png',
  'MoviesMod': 'https://moviesmod.army/wp-content/uploads/2022/12/moviesmodnew-Custom.png',
  'MoviesLeech': 'https://moviesleech.bar/wp-content/uploads/2024/07/topmovies-logo.png',
  'HDHub4U': 'https://new1.hdhub4u.cl/wp-content/uploads/2021/05/hdhub4ulogo.png',
  'HDHUB4U': 'https://new1.hdhub4u.cl/wp-content/uploads/2021/05/hdhub4ulogo.png',
  'KatMovieHD': 'https://new1.katmoviehd.cymru/wp-content/uploads/2022/03/cropped-cropped-KatMovie-G-S1.png',
  'KatmovieHD': 'https://new1.katmoviehd.cymru/wp-content/uploads/2022/03/cropped-cropped-KatMovie-G-S1.png',
  'DownloadHub': 'https://www.downloadhub.lat/logo.png',
  'DownloadHUB': 'https://www.downloadhub.lat/logo.png',
  'MLSBD': 'https://mlsbd.co/wp-content/uploads/2020/08/MLSBD-Logo.png',
  'CineDoze': 'https://cinedoze.tv/wp-content/uploads/2024/05/CineDoze.Com-Logo.png',
  'Cinedoze': 'https://cinedoze.tv/wp-content/uploads/2024/05/CineDoze.Com-Logo.png'
};

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  for (const [name, logoUrl] of Object.entries(mappings)) {
    const regex = new RegExp(`(name:\\s*['"]${name}['"][\\s\\S]*?logo:\\s*['"])(.*?)(['"])`, 'g');
    content = content.replace(regex, (match, p1, p2, p3) => {
        return p1 + logoUrl + p3;
    });
  }

  // Handle GlobalSearchModal specific updates if needed but this is a quick script.
  fs.writeFileSync(filePath, content);
}

updateFile('src/pages/Movies.tsx');
updateFile('src/data/searchResources.ts');
console.log('Fixed logos');
