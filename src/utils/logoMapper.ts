/// <reference types="vite/client" />
export const LOCAL_LOGOS = import.meta.glob('/public/logos/*.{png,jpg,svg}', { eager: true, query: '?url', import: 'default' });

// Pre-compute normalized logo names and their paths
const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const logoLookupMap = new Map<string, string>();
const logoEntries: { path: string; filename: string; rawLogoName: string; logoNorm: string; logoNormNoSuffix: string }[] = [];

for (const [path, url] of Object.entries(LOCAL_LOGOS)) {
    const filename = path.split('/').pop() || '';
    const rawLogoName = filename.replace(/\.[^/.]+$/, '');
    const logoNorm = normalize(rawLogoName);
    const logoNormNoSuffix = logoNorm.replace(/(logo|tv|hd|movies|stream|flix|net|com|org)$/, '');
    
    logoEntries.push({ path, filename, rawLogoName, logoNorm, logoNormNoSuffix });
    logoLookupMap.set(logoNorm, `/logos/${filename}`);
}

// Central configuration for precise overrides (domain -> local file path or remote URL)
export const LOGO_CONFIG: Record<string, string> = {
    'flixer.su': 'https://flixer.su/assets/images/logo.png',
    'cinehub.one': 'https://cinehub.one/cinehub-logo2.svg',
    'tbcpl.lol': 'https://tbcpl.lol/logo/movies_shows/nepu.png',
    'animesalt.ac': 'https://animesalt.ac/wp-content/uploads/AnimeSaltLong.png',
    'bitsearch.eu': '/logos/Bitsearch.png',
    'bitsearch.to': '/logos/Bitsearch.png',
    'hackathon.com': '/logos/Hackathon.png',
};

const domainLogoCache = new Map<string, string>();

export function getLogoForPortal(domain: string, nameStr: string, defaultLogo?: string): string {
    const cacheKey = `${domain}|${nameStr}`;
    if (domainLogoCache.has(cacheKey)) {
        return domainLogoCache.get(cacheKey)!;
    }

    const normName = normalize(nameStr);
    let domainHost = domain;
    try {
        const domainObj = new URL(domain.startsWith('http') ? domain : 'https://' + domain);
        domainHost = domainObj.hostname.replace(/^www\./, '').toLowerCase();
    } catch(e) {}
    
    // Check central configuration first
    if (LOGO_CONFIG[domainHost]) {
        domainLogoCache.set(cacheKey, LOGO_CONFIG[domainHost]);
        return LOGO_CONFIG[domainHost];
    }
    
    const rootDomainName = domainHost.split('.')[0];
    const normNameNoSuffix = normName.replace(/(tv|hd|movies|stream|flix|net|com|org)$/, '');

    // 1. O(1) Quick Map Lookup
    if (logoLookupMap.has(normName)) {
        const match = logoLookupMap.get(normName)!;
        domainLogoCache.set(cacheKey, match);
        return match;
    }
    if (logoLookupMap.has(rootDomainName)) {
        const match = logoLookupMap.get(rootDomainName)!;
        domainLogoCache.set(cacheKey, match);
        return match;
    }

    let strictMatch = null;
    let looseMatch = null;
    
    // 2. Iterate for heuristics if quick lookup failed
    for (const entry of logoEntries) {
        const { filename, rawLogoName, logoNorm, logoNormNoSuffix } = entry;
        const logoPath = `/logos/${filename}`;
        
        // Pass 1: PERFECT match
        if (
             rawLogoName.toLowerCase() === nameStr.toLowerCase() ||
             domainHost.startsWith(logoNorm + '.') ||
             logoNorm === domainHost.replace(/[^a-z0-9]/g, '')
        ) {
            domainLogoCache.set(cacheKey, logoPath);
            return logoPath;
        }

        // Pass 2: STRICT match (suffix/prefix removing)
        if (
             normName === logoNormNoSuffix ||
             rootDomainName === logoNormNoSuffix ||
             normNameNoSuffix === logoNorm ||
             normNameNoSuffix === logoNormNoSuffix
        ) {
            strictMatch = logoPath;
        }
        
        // Loose Match heuristics
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

        // Special Keyword fallbacks tailored to the user's specific files:
        if (logoNorm === 'watchott' && normName.includes('spencerdevs')) looseMatch = logoPath;
        if (logoNorm === 'onlyflixlogo' && normName.includes('onlyflix')) looseMatch = logoPath;
        if (logoNorm === 'netplay' && normName === 'netplayz') looseMatch = logoPath;
        if (logoNorm === 'movieplex1' && normName === 'movieplex') looseMatch = logoPath;
        if (logoNorm === '1primeshow' && normName === 'primeshows') looseMatch = logoPath;
        if (logoNorm === 'zxcstream' && normName === 'zxcprime') looseMatch = logoPath;
        if (logoNorm === 'surfacestream' && normName === 'watchsurface') looseMatch = logoPath;
    }
    
    if (strictMatch) {
        domainLogoCache.set(cacheKey, strictMatch);
        return strictMatch;
    }
    if (looseMatch) {
        domainLogoCache.set(cacheKey, looseMatch);
        return looseMatch;
    }
    
    const finalFallback = defaultLogo || '';
    domainLogoCache.set(cacheKey, finalFallback);
    return finalFallback;
}

export function getDynamicLogoUrl(url: string, name: string): string {
    // If it's returning empty from getLogoForPortal, we construct the fallback pipeline
    // But since Clearbit API can work by domain...
    try {
        const domain = new URL(url).hostname;
        return `https://logo.clearbit.com/${domain}?size=128&format=png`;
    } catch {
        return `https://www.google.com/s2/favicons?domain=${url}&sz=128`;
    }
}

// trigger rebuild
