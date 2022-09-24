import ts from 'typescript';
import type { Import } from './imports.js';
import { addImport } from './imports.js';
import parseImport from './parse-import.js';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const parseImports = (source: ts.SourceFile, filePath: string): Import[] => {
  const { statements } = source;
  const imports: Import[] = [];

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  Array.from(statements).forEach((statement: ts.Statement): void => {
    if (ts.isImportDeclaration(statement)) {
      const parsedImport = parseImport(statement, filePath);

      addImport(parsedImport);

      imports.push(parsedImport);
    }
  });

  return imports;
};

export default parseImports;
