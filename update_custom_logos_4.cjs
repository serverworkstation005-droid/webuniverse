const fs = require('fs');
const glob = require('glob');
const path = require('path');

const replacements = [
  { file: '1Flex.png', type: 'name', value: '1Flex' },
  { file: '1Shows.png', type: 'name', value: '1Shows' },
  { file: 'ShuttleTV.png', type: 'name', value: 'Shuttle TV' }, 
  { file: 'TOONSTREAM.png', type: 'name', value: 'Toonstream' },
  { file: 'TOONSTREAM.png', type: 'name', value: 'TOONSTREAM' },
  { file: 'bollyflix.png', type: 'domain', value: 'new.bollyflix.gd' },
  { file: 'cinebytv.png', type: 'name', value: 'Cineby TV' },
  { file: 'cinebytv.png', type: 'name', value: 'Cineby' }, // Cineby.app might also use it?
  { file: 'cinemora.png', type: 'name', value: 'Cinemora' },
  { file: 'corsflix.png', type: 'name', value: 'corsflix' },
  { file: 'corsflix.png', type: 'name', value: 'CorsFlix' },
  { file: 'rivestream.png', type: 'name', value: 'RiveStream' },
  { file: 'skyflixer.png', type: 'name', value: 'SkyFlixer' },
  { file: 'streamwatch.png', type: 'name', value: 'StreamWatch' },
  { file: 'vidbox.png', type: 'name', value: 'Vidbox' },
  { file: 'z-stream.png', type: 'name', value: 'Z-stream' },
  { file: 'z-stream.png', type: 'name', value: 'ZStream' },
  { file: 'z-stream.png', type: 'name', value: 'Z Stream' },
  { file: 'cinemalux.png', type: 'name', value: 'CinemaLux' },
  { file: 'filmyluxe.png', type: 'name', value: 'FilmyLuxe' },
  { file: 'movienestbd.png', type: 'name', value: 'MovieNest BD' },
  { file: 'olamovies.png', type: 'name', value: 'Ola Movies' },
  { file: 'vegamovies.png', type: 'name', value: 'VegaMovies' }
];

const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd(), absolute: true });

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;

  for (const rep of replacements) {
    const escapedValue = rep.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(${rep.type}:\\s*['"]${escapedValue}['"][^}]*?logo:\\s*['"])([^'"]+)(['"])`, 'gi');
    
    c = c.replace(pattern, (match, prefix, oldLogo, suffix) => {
      const newLogo = '/logos/' + rep.file;
      if (oldLogo !== newLogo) {
        console.log(`Updating ${rep.value} in ${path.basename(f)}: ${oldLogo} -> ${newLogo}`);
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
