const { execSync } = require('child_process');
execSync('git restore src/pages/*.tsx');
console.log('Restored');
