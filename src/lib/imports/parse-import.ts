import type { ImportDeclaration, ImportSpecifier, LiteralExpression } from 'typescript';
import areNamedImports from './are-named-imports.ts';
import extractPackageName from './extract-package-name.ts';
import getImportModuleNames from './get-import-module-names.ts';
import type { Import } from './imports.ts';

const parseImport = (statement: ImportDeclaration, filePath: string): Import => {
  const { text: moduleSpecifier } = statement.moduleSpecifier as LiteralExpression;
  const packageName = extractPackageName(moduleSpecifier);
  const { text: defaultName } = statement.importClause?.name ?? {};
  const { namedBindings } = statement.importClause ?? {};

  const named: Record<string, string> | undefined = areNamedImports(namedBindings)
    ? Array.from(namedBindings.elements).reduce(
        (acc, namedImport: ImportSpecifier) => ({
          ...acc,
          [namedImport.propertyName?.text ?? namedImport.name.text]: namedImport.name.text,
        }),
        {},
      )
    : undefined;

  const moduleNames = getImportModuleNames(defaultName, named);

  return { defaultName, filePath, moduleNames, moduleSpecifier, named, packageName };
};

export default parseImport;
