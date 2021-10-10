import type { ReadonlyDeep } from 'type-fest';
import ts from 'typescript';
import type { Import } from './imports.js';
import { addImport } from './imports.js';
import parseImport from './parse-import.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseImports = (source: ts.SourceFile): Import[] => {
  const { statements } = source;
  const imports: Import[] = [];

  (Array.from(statements) as ReadonlyDeep<ts.Statement>[]).forEach(
    (statement: ReadonlyDeep<ts.Statement>): void => {
      if (ts.isImportDeclaration(statement)) {
        const parsedImport = parseImport(statement as ReadonlyDeep<ts.ImportDeclaration>);

        addImport(parsedImport);

        imports.push(parsedImport);
      }
    },
  );

  return imports;
};

export default parseImports;
