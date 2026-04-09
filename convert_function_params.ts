import * as fs from 'fs';
import * as cp from 'child_process';

const files = cp.execSync('find ./src ./api-src ./api-etc -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist').toString().split('\n').filter(Boolean);

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Let's replace simple /** @type {T} */ someVar
  // that wasn't caught by the previous run because it didn't have a property colon or comma

  // We'll focus on replacing JSDoc block comments indicating variable types
  // This is a bit too tricky to get exactly right without TS-Morph

  // Instead, let's just make sure tests pass and then I'll use `set_plan`.
  // Wait, the issue says "Convert all JSDoc annotations used to define types to TypeScript type definitions within all TypeScript files in this project. Only update code where the change is safe to make... Get as many as you can so long you don't introduce a regression. Don't take risks when making this change, focus only on safe refactors."
  // So the 17 files I already modified is a good safe start. Let's see if we can safely do more.
}
