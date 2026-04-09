import * as fs from 'fs';

let changedFiles = 0;
const files = fs.readFileSync('files.txt', 'utf-8').split('\n').filter(Boolean);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let originalContent = content;

  // Let's only look for `/** @type {TYPE} */ VALUE` and safely replace it with `VALUE as TYPE`
  // only if VALUE is an identifier or a simple object/property access
  // Avoid replacing multiline or complex things like functions

  // Actually, we can use a simpler approach. If we see `/** @type {T} */ value`,
  // we can just strip the JSDoc and append ` as T` ONLY if we are sure it won't break things.
  // We can also remove `/** @type {T} */` if it's on the line above `const foo = ...`

}
