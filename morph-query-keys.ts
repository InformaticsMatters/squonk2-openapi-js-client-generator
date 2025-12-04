import { Project, SyntaxKind } from "ts-morph";
import { readFileSync } from "node:fs";

// const NO_CHECK_COMMENT = "// @ts-nocheck";

const project = new Project({
  tsConfigFilePath: "./tsconfig.json",
  skipAddingFilesFromTsConfig: true,
});

// Add all .ts files inside ./src (this includes index.ts, custom-instance.ts etc.)
project.addSourceFilesAtPaths(["./src/**/*.ts", "!./src/index.ts", "!./src/custom-instance.ts"]);

// We will filter out all of the extra ones (index.ts, custom-instance.ts etc.) by the number of "/"
// in the full file path. I.e. the ones we wan't to keep have one extra "/"
const getNumberOfParts = (apiFile: ReturnType<typeof project.getSourceFiles>[number]) =>
  apiFile.getFilePath().split("/").length;
const maxParts = Math.max(...project.getSourceFiles().map(getNumberOfParts));

// Extract API name from package.json
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8")) as { name: string };
// e.g., "@squonk/account-server-client" -> "account-server"
const apiName = packageJson.name.replace(/^@[^/]+\//, "").replace(/-client$/, "");

for (const apiFile of project.getSourceFiles()) {
  const fullText = apiFile.getFullText();
  // if (!fullText.includes(NO_CHECK_COMMENT)) {
  //   apiFile.insertStatements(0, NO_CHECK_COMMENT);
  // }

  if (getNumberOfParts(apiFile) === maxParts) {
    // get all variables used
    apiFile.getVariableStatements().forEach((variable) => {
      // get their declaration, multiple declarations are never used so [0] is ok
      const declaration = variable.getDeclarations()[0]; // 257 (SyntaxKind.VariableDeclaration)
      // locate QueryKey function
      if (declaration && declaration.getName().endsWith("QueryKey")) {
        // console.log(declaration);
        const arrow = declaration.getLastChildByKind(SyntaxKind.ArrowFunction);
        // need to get the array expression from inside the `[] as const` expression

        const array = arrow
          ?.getBody()
          .getFirstChildByKind(SyntaxKind.SyntaxList)
          ?.getFirstChildByKind(SyntaxKind.ReturnStatement)
          ?.getFirstChildByKind(SyntaxKind.AsExpression)
          ?.getLastChildByKind(SyntaxKind.ArrayLiteralExpression);

        if (array) {
          array.insertElement(0, `"${apiName}"`);
        }
      }
    });
  }
}

project.saveSync();
