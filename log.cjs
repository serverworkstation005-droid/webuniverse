const { execSync } = require("child_process");
try {
  const result = execSync("git log -p -5 src/pages/SmartSearch.tsx").toString();
  require("fs").writeFileSync("gitlog.txt", result);
} catch (e) {
  require("fs").writeFileSync("gitlog.txt", e.toString());
}
