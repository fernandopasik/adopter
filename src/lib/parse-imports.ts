import type { ReadonlyDeep } from 'type-fest';
import ts from 'typescript';

export interface Import {
  moduleSpecifier: string;
  defaultName?: string;
  named?: Record<string, string>;
}

export const areNamedImports = (
  namedBindings?: ReadonlyDeep<ts.NamedImportBindings>,
): namedBindings is ReadonlyDeep<ts.NamedImports> =>
  typeof namedBindings !== 'undefined' && ts.isNamedImports(namedBindings);

export const parseImport = (statement: ReadonlyDeep<ts.ImportDeclaration>): Import => {
  const { text: moduleSpecifier } = statement.moduleSpecifier as ts.LiteralExpression;
  const { text: defaultName } = statement.importClause?.name ?? {};
  const { namedBindings } = statement.importClause ?? {};

  const named: Record<string, string> | undefined = !areNamedImports(namedBindings)
    ? undefined
    : (Array.from(namedBindings.elements) as ReadonlyDeep<ts.ImportSpecifier>[]).reduce(
        (acc, namedImport: ReadonlyDeep<ts.ImportSpecifier>) => {
          const name = namedImport.propertyName?.text ?? namedImport.name.text;
          return {
            ...acc,
            [name]: namedImport.name.text,
          };
        },
        {},
      );

  return { moduleSpecifier, defaultName, named };
};

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseImports = (source: ts.SourceFile): Import[] => {
  const { statements } = source;
  const imports: Import[] = [];

  (Array.from(statements) as ReadonlyDeep<ts.Statement>[]).forEach(
    (statement: ReadonlyDeep<ts.Statement>): void => {
      if (ts.isImportDeclaration(statement)) {
        const parsedImport = parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>);

        if (!parsedImport.moduleSpecifier.startsWith('.')) {
          imports.push(parsedImport);
        }
      }
    },
  );

  return imports;
};

export default parseImports;
