const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      results.push(file);
    }
  });
  return results;
}

const files = walk("src");
let replacedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  const original = content;
  content = content.replace(/willChange:\s*["\047].*?["\047],?\s*/g, "");
  // also clean up empty style={{  }}
  content = content.replace(/style=\{\{\s*\}\}/g, "");
  // remove translate3d(0,0,0) and translateZ(0) if they are in style object
  content = content.replace(/transform:\s*["\047](translate3d\(0,0,0\)|translateZ\(0\))["\047],?\s*/g, "");
  content = content.replace(/backfaceVisibility:\s*["\047]hidden["\047],?\s*/g, "");
  content = content.replace(/WebkitBackfaceVisibility:\s*["\047]hidden["\047],?\s*/g, "");
  // if style string ends with a comma inside curly braces, clean it up
  content = content.replace(/,\s*\}/g, " }");
  // remove empty style attributes entirely
  content = content.replace(/style=\{\{\s*\}\}/g, "");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    replacedCount++;
    console.log("Cleaned:", file);
  }
});
console.log(`Cleaned ${replacedCount} files.`);
