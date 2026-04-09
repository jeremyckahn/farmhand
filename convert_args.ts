import * as fs from 'fs';
import * as cp from 'child_process';
import { Project, SyntaxKind } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

let changedFiles = 0;

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  const filePath = sourceFile.getFilePath();
  if (filePath.includes('node_modules') || filePath.includes('dist')) continue;

  const text = sourceFile.getFullText();

  // Very safe pattern replacements
  let newText = text;

  // Replace type casts in variable/property assignments safely
  // `/** @type {T} */ value` -> `value as T`
  newText = newText.replace(/(\w+)\s*:\s*\/\*\*\s*@type\s*\{([^}]+)\}\s*\*\/\s*([a-zA-Z0-9_.'"-]+(?:\[[a-zA-Z0-9_.'"-]+\])*)(,?)/g, (match, prop, typeStr, valueStr, comma) => {
     let newType = typeStr.trim();
     if (newType.startsWith('!')) newType = newType.substring(1);
     return `${prop}: ${valueStr} as ${newType}${comma}`;
  });

  // Replace function parameter JSDoc with TS types
  // e.g.
  // /**
  //  * @param {{ id: item['id'], quantity: number }[]} inventory
  //  */
  // => remove JSDoc and put inline parameter type
  // This is a bit too complex for regex, so let's stick to safe regex for block comments

  if (newText !== text) {
     fs.writeFileSync(filePath, newText);
  }
}
