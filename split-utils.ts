import { Project, SyntaxKind, VariableDeclaration, FunctionDeclaration } from 'ts-morph';
import fs from 'fs';
import path from 'path';

const project = new Project();
const utilsIndex = project.addSourceFileAtPath('src/utils/index.tsx');
const exportedDecls = utilsIndex.getExportedDeclarations();

const allExports: string[] = [];
for (const [name, decls] of exportedDecls.entries()) {
  allExports.push(name);
}

console.log(allExports);
