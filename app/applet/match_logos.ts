const fs = require('fs');
const path = require('path');

const logosDir = './public/logos';
const pagesDir = './src/pages';
const files = fs.readdirSync(logosDir).filter(f => f.endsWith('.png'));

function cleanStr(s) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

pageFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let code = fs.readFileSync(filePath, 'utf8');

  // Find all objects in the array
  const regex = /\{\s*name:\s*['"]([^'"]+)['"],\s*domain:\s*['"]([^'"]+)['"]([\s\S]*?)(?=\},|\}\s*\])/gi;
  
  let match;
  let newCode = code;
  
  let changes = [];
  while ((match = regex.exec(code)) !== null) {
    const fullMatch = match[0];
    const name = match[1];
    const domain = match[2];
    const rest = match[3];
    
    const cName = cleanStr(name);
    const cDomain = cleanStr(domain);
    const cDomainNoExt = cleanStr(domain.split('.')[0]);
    
    let bestLogo = null;
    let exactMatch = null;
    
    for (const logo of files) {
      const bLogo = logo.replace(/\.png$/i, '');
      const cbLogo = cleanStr(bLogo);
      const cbLogoNoExt = cleanStr(bLogo.split('.')[0]);
      
      if (cbLogo === cName || cbLogo === cDomain || cbLogo === cDomainNoExt || cbLogoNoExt === cDomainNoExt || cbLogoNoExt === cName) {
        exactMatch = logo;
        break;
      }
      
      if (
         (cbLogo.length > 3 && (cName.includes(cbLogo) || cDomain.includes(cbLogo) || cDomainNoExt.includes(cbLogoNoExt))) ||
         (cName.length > 3 && cbLogo.includes(cName)) ||
         (cDomainNoExt.length > 3 && cbLogo.includes(cDomainNoExt))
      ) {
         if (!bestLogo || cbLogo.length > cleanStr(bestLogo).length) {
            bestLogo = logo;
         }
      }
    }
    
    // some manual overrides that often fail
    let finalLogo = exactMatch || bestLogo;
    
    if (cName.includes('cineplay')) finalLogo = 'Cineplay.png';
    if (cName.includes('smashy')) finalLogo = 'SmashyStream.png';
    if (cDomain.includes('moviemask')) finalLogo = 'MovieMasks.png';
    if (cDomain.includes('kmmovies')) finalLogo = 'KMMovies.png';
    if (cDomain.includes('veloratv')) finalLogo = 'Velora.png';
    if (cDomain.includes('onlyflix')) finalLogo = 'onlyflix-logo.png';
    if (cName.includes('rartonepu')) finalLogo = 'RarToNepu.png';
    if (cName.includes('moviezone')) finalLogo = 'MovieZone.png';
    if (cDomain.includes('mappl')) finalLogo = 'Mapple.png';
    if (cName.includes('movihub')) finalLogo = 'MoviHUB.png';
    if (cDomain.includes('steam')) finalLogo = null; // Careful with vague matches
    
    // Do one more pass to be super sure about exact name checks vs manual logic, but whatever.
    // It's mostly fine if it matches accurately.
    
    if (finalLogo) {
      const hasLogo = /logo:\s*['"][^'"]*['"]/.test(rest);
      let newBlock = fullMatch;
      if (hasLogo) {
         newBlock = newBlock.replace(/logo:\s*['"][^'"]*['"]/, `logo: '/logos/${finalLogo}'`);
      } else {
         const typeMatch = newBlock.match(/(\n\s*type:\s*['"][^'"]*['"])/);
         if (typeMatch) {
            newBlock = newBlock.replace(/(\n\s*type:\s*['"][^'"]*['"])/, `$1,\n    logo: '/logos/${finalLogo}'`);
         } else {
            const tagsMatch = newBlock.match(/(tags:\s*\[[^\]]*\])/);
            if (tagsMatch) {
                newBlock = newBlock.replace(/(tags:\s*\[[^\]]*\])/, `$1,\n    logo: '/logos/${finalLogo}'`);
            } else {
                newBlock = newBlock + `\n    logo: '/logos/${finalLogo}'`;
            }
         }
      }
      
      if (newBlock !== fullMatch) {
         changes.push({old: fullMatch, new: newBlock});
      }
    }
  }
  
  for (const c of changes) {
     newCode = newCode.replace(c.old, c.new);
  }
  
  if (newCode !== code) {
     fs.writeFileSync(filePath, newCode);
  }
});

let remaining = files.filter(f => {
    let used = false;
    pageFiles.forEach(file => {
        let code = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        if (code.includes('/logos/' + f)) used = true;
    });
    return !used;
});

console.log("Unused:", remaining);
