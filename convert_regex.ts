import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Replace inline /** @type {T} */ value
  // Note: this only works for simple assignments where we can use `as T`
  content = content.replace(/\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([^,;\]\)\n\s]+(?:(?:\s|)[^,;\]\)\n\s]+)*)/g, (match, typeStr, valueStr) => {
     // A bit risky for complex expressions, let's just log them for manual inspection
     return match;
  });

}
