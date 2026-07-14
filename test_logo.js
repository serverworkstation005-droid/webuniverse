import fs from 'fs';

const LOCAL_LOGOS = fs.readdirSync('./public/logos').reduce((acc, file) => {
    acc['/public/logos/' + file] = file;
    return acc;
}, {});

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const logoLookupMap = new Map();
const logoEntries = [];

for (const path of Object.keys(LOCAL_LOGOS)) {
    const filename = path.split('/').pop() || '';
    const rawLogoName = filename.replace(/\.[^/.]+$/, '');
    const logoNorm = normalize(rawLogoName);
    const logoNormNoSuffix = logoNorm.replace(/(logo|tv|hd|movies|stream|flix|net|com|org)$/, '');
    
    logoEntries.push({ path, filename, rawLogoName, logoNorm, logoNormNoSuffix });
    logoLookupMap.set(logoNorm, `/logos/${filename}`);
}

function getLogoForPortal(domain, nameStr) {
    const normName = normalize(nameStr);
    let domainHost = domain;
    try {
        const domainObj = new URL(domain.startsWith('http') ? domain : 'https://' + domain);
        domainHost = domainObj.hostname.replace(/^www\./, '').toLowerCase();
    } catch(e) {}
    
    const rootDomainName = domainHost.split('.')[0];
    const normNameNoSuffix = normName.replace(/(tv|hd|movies|stream|flix|net|com|org)$/, '');
    
    if (logoLookupMap.has(normName)) {
        return logoLookupMap.get(normName);
    }
    if (logoLookupMap.has(rootDomainName)) {
        return logoLookupMap.get(rootDomainName);
    }
    let strictMatch = null;
    let looseMatch = null;
    
    for (const entry of logoEntries) {
        const { filename, rawLogoName, logoNorm, logoNormNoSuffix } = entry;
        const logoPath = `/logos/${filename}`;
        
        if (
             rawLogoName.toLowerCase() === nameStr.toLowerCase() ||
             domainHost.startsWith(logoNorm + '.') ||
             logoNorm === domainHost.replace(/[^a-z0-9]/g, '')
        ) {
            return logoPath;
        }
        
        if (
             normName === logoNormNoSuffix ||
             rootDomainName === logoNormNoSuffix ||
             normNameNoSuffix === logoNorm ||
             normNameNoSuffix === logoNormNoSuffix
        ) {
            strictMatch = logoPath;
        }
        
        if (
            (logoNorm.startsWith(normName) ||
              normName.startsWith(logoNorm) ||
              logoNorm.startsWith(rootDomainName) ||
              rootDomainName.startsWith(logoNorm) ||
             logoNorm.includes(normName) ||
             normName.includes(logoNorm) ||
             logoNorm.includes(rootDomainName)) &&
             logoNorm.length >= 4 && normName.length >= 4
        ) {
             if (!looseMatch) looseMatch = logoPath;
        }
    }
    
    if (strictMatch) return strictMatch;
    if (looseMatch) return looseMatch;
    return '';
}

console.log("PirateXPlay:", getLogoForPortal('piratexplay.cc', 'PirateXPlay'));
console.log("AnimeJoker:", getLogoForPortal('animejoker.com', 'AnimeJoker'));
console.log("DesiDubAnime:", getLogoForPortal('desidubanime.me', 'DesiDubAnime'));
console.log("Animoye:", getLogoForPortal('animoye.com', 'Animoye'));
