import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const filesToProcess = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        walk(fullPath);
      }
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      if (!fullPath.endsWith('.d.ts')) {
        filesToProcess.push(fullPath);
      }
    }
  }
}

walk(path.join(rootDir, 'src'));
walk(path.join(rootDir, 'api-src'));

console.log(`Found ${filesToProcess.length} files to process.`);

filesToProcess.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  let changes = [];

  function checkNode(node) {
    const jsDocTags = ts.getJSDocTags(node);
    if (jsDocTags.length > 0) {
      jsDocTags.forEach(tag => {
        let redundant = false;

        if (ts.isJSDocParameterTag(tag) && tag.typeExpression) {
          const paramName = tag.name.getText();
          let params = [];
          if (ts.isFunctionLike(node)) {
            params = node.parameters;
          } else if (ts.isVariableDeclaration(node) && node.initializer && ts.isFunctionLike(node.initializer)) {
            params = node.initializer.parameters;
          } else if (ts.isVariableStatement(node)) {
            node.declarationList.declarations.forEach(decl => {
              if (decl.initializer && ts.isFunctionLike(decl.initializer)) {
                params = decl.initializer.parameters;
              }
            });
          }

          const param = params.find(p => p.name.getText() === paramName);
          if (param && param.type) {
            redundant = true;
          }
        } else if (ts.isJSDocReturnTag(tag) && tag.typeExpression) {
          let type = null;
          if (ts.isFunctionLike(node)) {
            type = node.type;
          } else if (ts.isVariableDeclaration(node) && node.initializer && ts.isFunctionLike(node.initializer)) {
            type = node.initializer.type;
          } else if (ts.isVariableStatement(node)) {
            node.declarationList.declarations.forEach(decl => {
              if (decl.initializer && ts.isFunctionLike(decl.initializer)) {
                type = decl.initializer.type;
              }
            });
          }

          if (type) {
            redundant = true;
          }
        } else if (ts.isJSDocTypeTag(tag) && tag.typeExpression) {
          let type = null;
          if (ts.isVariableDeclaration(node)) {
            type = node.type;
          } else if (ts.isPropertyDeclaration(node)) {
            type = node.type;
          } else if (ts.isVariableStatement(node)) {
             // If any declaration in the statement has a type, we consider it redundant for the whole statement's JSDoc
             type = node.declarationList.declarations.find(decl => decl.type);
          }

          if (type) {
            redundant = true;
          }
        }

        if (redundant) {
          changes.push({
            start: tag.typeExpression.getStart(sourceFile),
            end: tag.typeExpression.getEnd()
          });
        }
      });
    }
    ts.forEachChild(node, checkNode);
  }

  ts.forEachChild(sourceFile, checkNode);

  if (changes.length > 0) {
    // Deduplicate and sort changes from end to start
    const uniqueChanges = [];
    const seen = new Set();
    changes.forEach(c => {
        const key = `${c.start}-${c.end}`;
        if (!seen.has(key)) {
            uniqueChanges.push(c);
            seen.add(key);
        }
    });
    uniqueChanges.sort((a, b) => b.start - a.start);

    let newContent = content;
    uniqueChanges.forEach(change => {
      newContent = newContent.slice(0, change.start) + newContent.slice(change.end);
    });

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`Updated ${file}`);
    }
  }
});
