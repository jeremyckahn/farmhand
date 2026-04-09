import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find ./src ./api-src ./api-etc -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Pattern: /** @type {SomeType} */ SomeVar
  // Specifically looking for things like: /** @type {'GRAPE'} */ cropFamily.GRAPE
  // or /** @type {farmhand.recipeType} */ recipeType.KITCHEN
  // or /** @type {farmhand.itemType} */ 'CRAFTED_ITEM'
  // or /** @type {farmhand.item} */ { ... }
  content = content.replace(/\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([a-zA-Z0-9_.'"-]+(?:\[[a-zA-Z0-9_.'"-]+\])*)/g, (match, typeStr, valueStr) => {
     // Exclude if value is just '{' or something weird (though our regex prevents that)
     return `${valueStr} as ${typeStr}`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    changedFiles++;
  }
}
console.log(`Changed ${changedFiles} files`);
