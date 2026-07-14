const fs = require('fs');

const files = [
  'src/pages/Movies.tsx',
  'src/pages/Streaming.tsx',
  'src/data/searchResources.ts', // If they exist
  'src/components/GlobalSearchModal.tsx'
];

const replacements = [
  { file: '1Flex.png', type: 'name', value: '1Flex' },
  { file: '1Shows.png', type: 'name', value: '1Shows' },
  { file: 'ShuttleTV.png', type: 'name', value: 'Shuttle TV' }, 
  { file: 'ShuttleTV.png', type: 'domain', value: 'shuttletv.su' }, 
  { file: 'TOONSTREAM.png', type: 'name', value: 'Toonstream' },
  { file: 'TOONSTREAM.png', type: 'name', value: 'TOONSTREAM' },
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

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;

  for (const rep of replacements) {
    const escapedValue = rep.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // We match `type: 'value'` up to the very next `logo: 'url'`, inside a same object block hopefully
    // by ensuring we don't cross `{` or `}`.
    const pattern = new RegExp(`(${rep.type}:\\s*['"]${escapedValue}['"][^}]*?logo:\\s*['"])([^'"]+)(['"])`, 'gi');
    
    c = c.replace(pattern, (match, prefix, oldLogo, suffix) => {
      const newLogo = '/logos/' + rep.file;
      if (oldLogo !== newLogo) {
        console.log(`Updating ${rep.value} in ${f}: ${oldLogo} -> ${newLogo}`);
        changed = true;
        return prefix + newLogo + suffix;
      }
      return match;
    });
  }

  if (changed) {
    fs.writeFileSync(f, c);
  }
});
