import fs from 'fs';

const domainsToRemove = [
  'm4ckd0ge-repacks.site',
  'thepcgames.net',
  'skidrowreloaded.com',
  'pcgamestorrents.com',
  'gamesofpc.com',
  'apunkagames.net',
  'gload.to',
  'indiedb.com',
  '1337x.to',
  'armorgames.com'
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // A regex to match an object literal block { ... domain: 'something' ... }
  // Since we want to remove the entire object, we can look for "{\n(anything not {)domain: '...' (anything not })},?"
  // But regex for nested braces is hard if there are nested braces. In these files, it's mostly flat objects.
  
  for (const domain of domainsToRemove) {
    const regex = new RegExp(`\\s*{\\s*name:[^}]+domain:\\s*['"\`]${domain.replace(/\./g, '\\.')}['"\`][^}]+},?`, 'g');
    content = content.replace(regex, '');
  }
  
  fs.writeFileSync(filePath, content);
}

processFile('src/pages/Games.tsx');
processFile('src/pages/Torrents.tsx');
processFile('src/data/searchResources.ts');
