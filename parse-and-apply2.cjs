const fs = require('fs');
const { execSync } = require('child_process');

const filesStr = execSync('grep -rl "@param" src/', { encoding: 'utf8' });
const files = filesStr.trim().split('\n');

for (const file of files) {
  if (!fs.existsSync(file)) continue;

  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We need to parse block by block.
  // This is best done via regex matching function signatures.
  // Actually, since I have `ts-morph`, I can just use it effectively without failing on AST errors!
}
