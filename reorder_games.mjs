import fs from 'fs';

const requestedOrder = [
  'worldofpcgames.com',
  'gogunlocked.com',
  'steamunlocked.org',
  'steamrip.com',
  'steamora.net',
  'steamgg.net',
  'gamesleech.com',
  'ovagames.com',
  'www.4fnet.org',
  'repack-games.com',
  'elamigos.site',
  'dodi-repacks.download',
  'fitgirl-repacks.site',
  'igg-games.com'
];

let content = fs.readFileSync('src/pages/Games.tsx', 'utf8');

// Extract all providers
const regex = /{\s*name:\s*['"][^'"]+['"],\s*domain:\s*['"]([^'"]+)['"][\s\S]*?},?/g;

const providers = [];
let match;
while ((match = regex.exec(content)) !== null) {
  providers.push({
    domain: match[1],
    fullText: match[0],
    index: match.index
  });
}

// Find the providers that need to be reordered
const orderToReorder = requestedOrder;
const extractedProviders = {};

for (const domain of orderToReorder) {
  const provider = providers.find(p => p.domain === domain);
  if (provider) {
    extractedProviders[domain] = provider.fullText.replace(/,$/, '');
  }
}

// Remove all reordered providers from content
for (const p of providers) {
  if (orderToReorder.includes(p.domain)) {
    content = content.replace(p.fullText, '');
  }
}

// Ensure no multiple empty lines are left
content = content.replace(/(\n\s*){3,}/g, '\n\n');

// Find insertion point - we will insert them where the first one was
const targetDomain = 'oceanofgames.com'; // Wait, let's just insert at the beginning of the GAMES_LINKS array.
// Let's find "const GAMES_LINKS: PortalItem[] = ["

const listStartMatch = /const GAMES_LINKS: PortalItem\[\] = \[\s*/.exec(content);
if (listStartMatch) {
  const insertPos = listStartMatch.index + listStartMatch[0].length;
  const reorderedStrings = requestedOrder.map(domain => extractedProviders[domain]).filter(Boolean).map(text => text + ',').join('\n');
  content = content.slice(0, insertPos) + reorderedStrings + '\n' + content.slice(insertPos);
}

fs.writeFileSync('src/pages/Games.tsx', content);

