import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find ./src ./api-src ./api-etc -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

function safeType(typeStr) {
   // convert JSDoc type to TS type
   // eg ?farmhand.plotContent -> farmhand.plotContent | null
   let t = typeStr.trim();
   if (t.startsWith('?')) {
     return t.substring(1) + ' | null';
   }
   if (t.startsWith('!')) {
     return t.substring(1);
   }
   // Array.<T> -> T[]
   if (t.startsWith('Array.<') && t.endsWith('>')) {
      return t.substring(7, t.length - 1) + '[]';
   }
   // Object.<string, T> -> Record<string, T>
   if (t.startsWith('Object.<') && t.endsWith('>')) {
      const inner = t.substring(8, t.length - 1);
      return `Record<${inner}>`;
   }
   return t;
}

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Pattern 1: Inline type casting for simple values
  // e.g. /** @type {'GRAPE'} */ cropFamily.GRAPE -> cropFamily.GRAPE as 'GRAPE'
  content = content.replace(/\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([a-zA-Z0-9_.'"-]+(?:\[[a-zA-Z0-9_.'"-]+\])*)/g, (match, typeStr, valueStr) => {
     // Skip if it looks like a function or object block
     if (['return', 'const', 'let', 'var', 'export'].includes(valueStr.trim())) return match;
     const newType = safeType(typeStr);
     return `${valueStr} as ${newType}`;
  });

  // Pattern 2: Inline type casting for blocks
  // e.g. /** @type {farmhand.item} */ { -> { ... } as farmhand.item
  // Actually, too risky, let's skip for now, but there are a few of these we could manually fix

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
}
console.log(`Changed ${changedFiles} files`);
