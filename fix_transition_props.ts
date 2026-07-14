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

filesParams.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Fix the broken React props `transition={{`
  content = content.replace(/transition-all duration-\[[^\]]+\] ease-\[[^\]]+\]=\{\{/g, 'transition={{');
  // Fix any `{...{ transition-all duration... }}` broken things if there are any
  content = content.replace(/transition-all duration-\[[^\]]+\] ease-\[[^\]]+\]=\{([^\{])/g, 'transition={$1');
  // Also Framer motion transition={{ ..., transition: { ... } }}
  content = content.replace(/transition-all duration-\[[^\]]+\] ease-\[[^\]]+\]: \{/g, 'transition: {');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed React Transition Props: ${file}`);
  }
});
