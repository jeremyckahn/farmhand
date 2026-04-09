import * as fs from 'fs';
import * as cp from 'child_process';
import { Project, SyntaxKind, VariableDeclaration } from 'ts-morph';

const project = new Project({ tsConfigFilePath: 'tsconfig.json' });

let changedFiles = 0;

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  const filePath = sourceFile.getFilePath();
  if (filePath.includes('node_modules') || filePath.includes('dist')) continue;

  const vars = sourceFile.getDescendantsOfKind(SyntaxKind.VariableStatement);
  for (const varStmt of vars) {
     const jsDocs = varStmt.getJsDocs();
     if (jsDocs.length === 0) continue;

     const decls = varStmt.getDeclarations();
     if (decls.length !== 1) continue;

     const decl = decls[0];
     const typeTags = jsDocs[0].getTags().filter(t => t.getTagName() === 'type');

     if (typeTags.length === 1 && !decl.getTypeNode() && decl.getInitializer()) {
        const typeStr = typeTags[0].getCommentText() || '';
        // Only safely handle array or primitive types to avoid breaking syntax
        let parsedType = typeStr.replace(/[{}]/g, '').trim();
        if (parsedType.startsWith('!')) parsedType = parsedType.substring(1);
        if (parsedType.startsWith('?')) parsedType = parsedType.substring(1) + ' | null';
        if (parsedType.startsWith('Array.<')) {
           parsedType = parsedType.replace('Array.<', '').replace('>', '[]');
        }

        // Let's only do simple names like farmhand.item[]
        if (/^[a-zA-Z0-9_.[\]| ]+$/.test(parsedType)) {
           // Wait, the task says "Convert all JSDoc annotations used to define types to TypeScript type definitions".
           // That means `const foo: TYPE = bar;`
           // But I don't want to break the codebase. Let's just do a manual replace.
        }
     }
  }
}
