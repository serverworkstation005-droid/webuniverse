const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Movies.tsx',
  'src/pages/Streaming.tsx',
  'src/data/searchResources.ts',
  'src/components/GlobalSearchModal.tsx'
];

// Note: name matching will just use simple string parts to avoid regex escaping headaches here
const replacements = [
  { file: '1Flex.png', type: 'name', value: '1Flex' },
  { file: '1Shows.png', type: 'name', value: '1Shows' },
  { file: 'ShuttleTV.png', type: 'name', value: 'Shuttle TV' }, // wait, name is Shuttle TV? Let's check value
  { file: 'ShuttleTV.png', type: 'domain', value: 'shuttletv.su' }, 
  { file: 'TOONSTREAM.png', type: 'domain', value: 'toonstream' },
  { file: 'bollyflix.png', type: 'domain', value: 'new.bollyflix.gd' },
  { file: 'cinebytv.png', type: 'name', value: 'Cineby TV' },
  { file: 'cinemora.png', type: 'name', value: 'Cinemora' },
  { file: 'corsflix.png', type: 'domain', value: 'corsflix' },
  { file: 'rivestream.png', type: 'name', value: 'RiveStream' },
  { file: 'skyflixer.png', type: 'name', value: 'SkyFlixer' },
  { file: 'streamwatch.png', type: 'name', value: 'StreamWatch' },
  { file: 'vidbox.png', type: 'name', value: 'Vidbox' },
  { file: 'z-stream.png', type: 'domain', value: 'z-stream' },
  { file: 'cinemalux.png', type: 'name', value: 'CinemaLux' },
  { file: 'filmyluxe.png', type: 'name', value: 'FilmyLuxe' },
  { file: 'movienestbd.png', type: 'name', value: 'MovieNest BD' },
  { file: 'olamovies.png', type: 'name', value: 'Ola Movies' },
  { file: 'vegamovies.png', type: 'name', value: 'VegaMovies' }
];

for (let file of files) {
  file = path.join(process.cwd(), file);
  if (!fs.existsSync(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  for (const rep of replacements) {
    const key = rep.type; // 'name' or 'domain'
    // This regex looks for key: 'value' (or "value"), followed by anything EXCEPT 'name:' or 'domain:' up to logo: 'url'.
    // If it finds it, it replaces the url.
    // We escape the value string for regex, except we'll use a simpler approach:
    
    const escapedValue = rep.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Regex that matches: name: '1Flex' followed by some stuff until logo: '...'
    // To prevent matching into the next portal, we should ensure the intermediate stuff doesn't contain '{' or 'name:' or 'domain:'
    const regexPattern = new RegExp(`${key}:\\s*(['"])${escapedValue}(?:.*?)\\1(?:(?:(?!name:|domain:)[^])*?)logo:\\s*(['"])(.*?)\\2`, 'i');
    
    content = content.replace(regexPattern, (fullMatch, quote1, quote2, oldLogoUrl) => {
      const newLogo = '/logos/' + rep.file;
      if (oldLogoUrl !== newLogo) {
        console.log(`Matched ${rep.value} in ${file}. Replacing ${oldLogoUrl} -> ${newLogo}`);
        changed = true;
        
        const lastIdx = fullMatch.lastIndexOf(oldLogoUrl);
        return fullMatch.substring(0, lastIdx) + newLogo + fullMatch.substring(lastIdx + oldLogoUrl.length);
      }
      return fullMatch;
    });
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
}
