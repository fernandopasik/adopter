import type { ReadonlyDeep } from 'type-fest';
import type ts from 'typescript';
import areNamedImports from './are-named-imports.js';
import extractPackageName from './extract-package-name.js';
import getImportModuleNames from './get-import-module-names.js';
import type { Import } from './imports.js';

const parseImport = (statement: ReadonlyDeep<ts.ImportDeclaration>, filePath: string): Import => {
  const { text: moduleSpecifier } = statement.moduleSpecifier as ts.LiteralExpression;
  const packageName = extractPackageName(moduleSpecifier);
  const { text: defaultName } = statement.importClause?.name ?? {};
  const { namedBindings } = statement.importClause ?? {};

  const named: Record<string, string> | undefined = !areNamedImports(namedBindings)
    ? undefined
    : (Array.from(namedBindings.elements) as ReadonlyDeep<ts.ImportSpecifier>[]).reduce(
        (acc, namedImport: ReadonlyDeep<ts.ImportSpecifier>) => ({
          ...acc,
          [namedImport.propertyName?.text ?? namedImport.name.text]: namedImport.name.text,
        }),
        {},
      );

  const moduleNames = getImportModuleNames(defaultName, named);

  return { filePath, moduleSpecifier, packageName, defaultName, named, moduleNames };
};

export default parseImport;
