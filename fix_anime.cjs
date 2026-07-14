const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'pages', 'Anime.tsx');
let content = fs.readFileSync(p, 'utf-8');

// The first object has:
// tags: ['Sub/Dub', 'Fast',
//   {
//     name: 'Enma',
content = content.replace(/tags: \['Sub\/Dub', 'Fast',/, "tags: ['Sub/Dub', 'Fast'],\n        type: 'Streaming'\n     },\n");

// At the end of Anime.tsx:
//        logo: 'https://www.google.com/s2/favicons?domain=aniworld.to&sz=128'}
// ];
content = content.replace(/logo: 'https:\/\/www\.google\.com\/s2\/favicons\?domain=aniworld\.to&sz=128'\}/, "logo: 'https://www.google.com/s2/favicons?domain=aniworld.to&sz=128'}\n    ]\n  }");

fs.writeFileSync(p, content, 'utf-8');

const t = path.join(__dirname, 'src', 'pages', 'Typing.tsx');
// let's check what's broken in Tech and Typing
