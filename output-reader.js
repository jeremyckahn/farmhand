const { execSync } = require('child_process');
const fs = require('fs');
try {
  const result = execSync('npx tsc --noEmit', { encoding: 'utf8' });
  fs.writeFileSync('result.txt', result);
} catch (e) {
  fs.writeFileSync('result.txt', e.stdout.toString());
}
console.log(fs.readFileSync('result.txt', 'utf8').substring(0, 100));
