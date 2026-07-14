import fs from 'fs';
const content = fs.readFileSync('src/utils/logoMapper.ts', 'utf8');
fs.writeFileSync('src/utils/logoMapper.ts', content + '\n// trigger rebuild\n');
