import { Project, SyntaxKind } from "ts-morph";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

// Add all .ts files inside ./src (this includes index.ts, custom-instance.ts etc.)
project.addSourceFilesAtPaths("./src/**/*.ts");

// We will filter out all of the extra ones (index.ts, custom-instance.ts etc.) by the number of "/"
// in the full file path. I.e. the ones we wan't to keep have one extra "/"
const getNumberOfParts = (apiFile) => apiFile.getFilePath().split("/").length; // ! Requires Windows?
const maxParts = Math.max(...project.getSourceFiles().map(getNumberOfParts));

const apiName = process.argv.at(-1); // ! probably requires a recent NodeJS version

for (const apiFile of project.getSourceFiles()) {
  if (getNumberOfParts(apiFile) === maxParts) {
    // get all variables used
    apiFile.getVariableStatements().forEach((variable) => {
      // get their declaration, multiple declarations are never used so [0] is ok
      const declaration = variable.getDeclarations()[0]; // 257 (SyntaxKind.VariableDeclaration)
      // locate QueryKey function
      if (declaration.getName().endsWith("QueryKey")) {
        // console.log(declaration);
        const arrow = declaration.getLastChildByKind(SyntaxKind.ArrowFunction);
        // need to get the array expression from inside the `[] as const` expression

        const array = arrow
          .getBody()
          .getFirstChildByKind(SyntaxKind.SyntaxList)
          .getFirstChildByKind(SyntaxKind.ReturnStatement)
          .getFirstChildByKind(SyntaxKind.AsExpression)
          .getLastChildByKind(SyntaxKind.ArrayLiteralExpression);
        array.insertElement(0, `"${apiName}"`);
      }
    });
  }
}

project.saveSync();
