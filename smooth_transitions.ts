import fs from 'fs';
import path from 'path';

const walkSync = (dir: string, filelist: string[] = []): string[] => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules')) {
        filelist = walkSync(filePath, filelist);
      }
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const componentsDir = path.join(process.cwd(), 'src', 'components');
const filesParams = walkSync(componentsDir);
filesParams.push(path.join(process.cwd(), 'src', 'App.tsx'));

const BUTTERY = 'duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]';

filesParams.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace anything like duration-300, duration-500, duration-[400ms] with duration-[600ms]
  content = content.replace(/duration-(?:150|200|300|400|500|700|1000|\[\d+ms\])/g, 'duration-[600ms]');
  
  // Replace existing ease classes with the buttery bezier curve
  content = content.replace(/(?<!ease-\[)ease-(?:out|in-out|in)/g, 'ease-[cubic-bezier(0.16,1,0.3,1)]');
  content = content.replace(/ease-\[cubic-bezier\([^\]]+\)\]/g, 'ease-[cubic-bezier(0.16,1,0.3,1)]');

  // Replace plain transition classes that don't have duration already next to them with the buttery combo
  content = content.replace(/transition-colors\b(?!\s*duration)/g, `transition-colors ${BUTTERY}`);
  content = content.replace(/transition-opacity\b(?!\s*duration)/g, `transition-opacity ${BUTTERY}`);
  content = content.replace(/transition-transform\b(?!\s*duration)/g, `transition-transform ${BUTTERY}`);
  content = content.replace(/transition-all\b(?!\s*duration)/g, `transition-all ${BUTTERY}`);
  content = content.replace(/transition\b(?!\s*duration|-all|-colors|-opacity|-transform)/g, `transition-all ${BUTTERY}`);

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
