import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find ./src ./api-src ./api-etc -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Pattern: (foo = /** @type {Type} */ (value))
  content = content.replace(/\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*\(([a-zA-Z0-9_.'"-]+(?:\[[a-zA-Z0-9_.'"-]+\])*)\)/g, (match, typeStr, valueStr) => {
     let newType = typeStr.trim();
     if (newType.startsWith('!')) newType = newType.substring(1);
     return `(${valueStr} as ${newType})`;
  });

  // Pattern: `/** @type {Type} */ value` not inside an object literal
  // but it's risky if value is complex. Let's just do identifiers
  content = content.replace(/\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([a-zA-Z0-9_.'"-]+)([\s,)\];])/g, (match, typeStr, valueStr, suffix) => {
     let newType = typeStr.trim();
     if (newType.startsWith('!')) newType = newType.substring(1);
     // Avoid `import` or `const` or `export`
     if (['import', 'const', 'let', 'var', 'export', 'return'].includes(valueStr)) return match;
     return `(${valueStr} as ${newType})${suffix}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
}
console.log(`Changed ${changedFiles} files`);
