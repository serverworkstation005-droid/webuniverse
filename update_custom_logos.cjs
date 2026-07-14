const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Movies.tsx',
  'src/pages/Streaming.tsx',
  'src/data/searchResources.ts',
  'src/components/GlobalSearchModal.tsx'
];

const logos = [
  { file: '1Flex.png', match: /name:\s*['"]1Flex['"]/gi },
  { file: '1Shows.png', match: /name:\s*['"]1Shows['"]/gi },
  { file: 'ShuttleTV.png', match: /domain:\s*['"]shuttletv\.su['"]/gi },
  { file: 'TOONSTREAM.png', match: /domain:\s*['"]toonstream.*['"]/gi },
  { file: 'bollyflix.png', match: /domain:\s*['"]new\.bollyflix\.gd['"]/gi },
  { file: 'cinebytv.png', match: /name:\s*['"]Cineby\s*TV['"]/gi },
  { file: 'cinemora.png', match: /name:\s*['"]Cinemora['"]/gi },
  { file: 'corsflix.png', match: /domain:\s*['"]corsflix.*['"]/gi },
  { file: 'rivestream.png', match: /name:\s*['"]RiveStream['"]/gi },
  { file: 'skyflixer.png', match: /name:\s*['"]SkyFlixer['"]/gi },
  { file: 'streamwatch.png', match: /name:\s*['"]StreamWatch['"]/gi },
  { file: 'vidbox.png', match: /name:\s*['"]Vidbox['"]/gi },
  { file: 'z-stream.png', match: /domain:\s*['"]z-stream.*['"]/gi },
  { file: 'cinemalux.png', match: /name:\s*['"]CinemaLux['"]/gi },
  { file: 'filmyluxe.png', match: /name:\s*['"]FilmyLuxe['"]/gi },
  { file: 'movienestbd.png', match: /name:\s*['"]MovieNest\s*BD['"]/gi },
  { file: 'olamovies.png', match: /name:\s*['"]Ola\s*Movies['"]/gi },
  { file: 'vegamovies.png', match: /name:\s*['"]VegaMovies['"]/gi }
];

for (let file of files) {
  file = path.join(process.cwd(), file); // Should correctly resolve to /src/...
  if (!fs.existsSync(file)) {
    console.log(`File missing: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const logo of logos) {
    const match = logo.match;
    const searchRegex = new RegExp(match.source + /((?:(?!name:|domain:).)*?)logo:\s*['"](.*?)['"]/is.source, 'gi');
    
    content = content.replace(searchRegex, (fullMatch, intermediate, oldLogo) => {
      let newLogoFile = logo.file;
      const newLogo = '/logos/' + newLogoFile;
      if (oldLogo !== newLogo) {
        console.log(`Replacing logo in ${file} for match ${match.source} -> ${newLogo}`);
        changed = true;
        let lastIdx = fullMatch.lastIndexOf(oldLogo);
        return fullMatch.substring(0, lastIdx) + newLogo + fullMatch.substring(lastIdx + oldLogo.length);
      }
      return fullMatch;
    });
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
