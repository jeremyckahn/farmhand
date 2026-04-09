import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find ./src ./api-src ./api-etc -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // We only replace lines that are just simple variable assignments like
  // property: /** @type {Type} */ value,

  content = content.replace(/(\w+)\s*:\s*\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([a-zA-Z0-9_.'"-]+(?:\[[a-zA-Z0-9_.'"-]+\])*)(,?)/g, (match, prop, typeStr, valueStr, comma) => {
     let newType = typeStr.trim();
     if (newType.startsWith('!')) newType = newType.substring(1);
     return `${prop}: ${valueStr} as ${newType}${comma}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
}
console.log(`Changed ${changedFiles} files`);
