const fs = require('fs');
const path = require('path');

function checkFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  let changed = false;

  const importRegex = /(?:import|export)\s+(?:(?:[\s\S]*?)\s+from\s+)?['"]([^'"]+)['"]/g;

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    let originalImport = match[0];
    let importPath = match[1];
    let strippedPath = importPath.split('?')[0];

    if (strippedPath.startsWith('.')) {
        let absolutePath = path.resolve(path.dirname(file), strippedPath);

        let targetExt = '';

        // Let's resolve what file it ACTUALLY points to.
        if (fs.existsSync(absolutePath)) {
             if (fs.statSync(absolutePath).isDirectory()) {
                 if (fs.existsSync(absolutePath + '/index.ts')) targetExt = '/index.ts';
                 else if (fs.existsSync(absolutePath + '/index.tsx')) targetExt = '/index.tsx';
                 else if (fs.existsSync(absolutePath + '/index.js')) targetExt = '/index.js';
                 else if (fs.existsSync(absolutePath + '/index.jsx')) targetExt = '/index.jsx';

                 // if it points to a directory, we rewrite it
                 if (targetExt !== '') {
                    let newImportPath = '';
                    let queryIndex = importPath.indexOf('?');
                    if (queryIndex !== -1) {
                        newImportPath = importPath.substring(0, queryIndex) + targetExt + importPath.substring(queryIndex);
                    } else {
                        newImportPath = importPath + targetExt;
                    }

                    if (newImportPath !== importPath) {
                        console.log(`Fixing directory import ${importPath} -> ${newImportPath} in ${file}`);
                        newContent = newContent.split(`'${importPath}'`).join(`'${newImportPath}'`);
                        newContent = newContent.split(`"${importPath}"`).join(`"${newImportPath}"`);
                        changed = true;
                    }
                 }
             } else {
                 // it points directly to an existing file
                 // If the import path is EXACTLY the filename, we are good.
                 // In Vite/Farmhand, sometimes it imports .js but the file is .ts, so it wouldn't exist and would hit the else block.
             }
        } else {
            // File does not exist. It's either missing an extension, or the extension in the import (.js) is wrong.
            if (strippedPath.endsWith('.js')) {
                let base = absolutePath.substring(0, absolutePath.length - 3);
                if (fs.existsSync(base + '.ts')) targetExt = '.ts';
                else if (fs.existsSync(base + '.tsx')) targetExt = '.tsx';
                else if (fs.existsSync(base + '.jsx')) targetExt = '.jsx';
            } else if (!strippedPath.match(/\.[a-zA-Z0-9]+$/)) {
                 // it has no extension
                 if (fs.existsSync(absolutePath + '.ts')) targetExt = '.ts';
                 else if (fs.existsSync(absolutePath + '.tsx')) targetExt = '.tsx';
                 else if (fs.existsSync(absolutePath + '.jsx')) targetExt = '.jsx';
                 else if (fs.existsSync(absolutePath + '.js')) targetExt = '.js';
                 else if (fs.existsSync(absolutePath + '/index.ts')) targetExt = '/index.ts';
                 else if (fs.existsSync(absolutePath + '/index.tsx')) targetExt = '/index.tsx';
                 else if (fs.existsSync(absolutePath + '/index.js')) targetExt = '/index.js';
                 else if (fs.existsSync(absolutePath + '.sass')) targetExt = '.sass';
            }

            if (targetExt !== '') {
                let newImportPath = '';
                let queryIndex = importPath.indexOf('?');

                if (strippedPath.endsWith('.js') && targetExt.startsWith('.')) {
                    // strip .js
                    let stripped = importPath.substring(0, queryIndex !== -1 ? queryIndex : importPath.length);
                    stripped = stripped.substring(0, stripped.length - 3);
                    newImportPath = stripped + targetExt + (queryIndex !== -1 ? importPath.substring(queryIndex) : '');
                } else {
                    if (queryIndex !== -1) {
                        newImportPath = importPath.substring(0, queryIndex) + targetExt + importPath.substring(queryIndex);
                    } else {
                        newImportPath = importPath + targetExt;
                    }
                }

                if (newImportPath !== importPath) {
                  console.log(`Fixing ${importPath} -> ${newImportPath} in ${file}`);
                  newContent = newContent.split(`'${importPath}'`).join(`'${newImportPath}'`);
                  newContent = newContent.split(`"${importPath}"`).join(`"${newImportPath}"`);
                  changed = true;
                }
            }
        }
    }
  }

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
  }
}

function findFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath);
    } else if (fullPath.match(/\.(js|jsx|ts|tsx)$/)) {
      checkFile(fullPath);
    }
  }
}

findFiles('./src');
