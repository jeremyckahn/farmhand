import { Project, SyntaxKind, VariableDeclaration, ParameterDeclaration, PropertyAssignment, TypeAssertion, AsExpression, CallExpression } from "ts-morph";
import * as fs from 'fs';

const project = new Project({ tsConfigFilePath: "tsconfig.json" });

let modifiedCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  let changed = false;
  const filePath = sourceFile.getFilePath();
  // ignore node_modules
  if (filePath.includes('node_modules')) continue;
  if (filePath.includes('dist')) continue;

  const jsDocs = sourceFile.getDescendantsOfKind(SyntaxKind.JSDoc);

  // We cannot easily map TS-Morph JSDoc to specific syntax tokens for inline type casting
  // like `/** @type {T} */ foo` because TS-Morph often parses these as just Comments, not JSDoc nodes attached to the variable if they are inline.
}

console.log('Done');
