import { Project, SyntaxKind, TypeGuards, JSDocTag } from "ts-morph";

const project = new Project({
    tsConfigFilePath: "tsconfig.json",
});

const files = project.getSourceFiles();
let totalFilesChanged = 0;

files.forEach(sourceFile => {
    let changed = false;

    // We can iterate over variable declarations, parameter declarations, property declarations, and function returns

    // We want to avoid using regexes that mess up the files. We can use TS-Morph for AST manipulation
    const jsDocs = sourceFile.getDescendantsOfKind(SyntaxKind.JSDoc);

    // First pass: identify JSDoc @type or @param or @returns

});
