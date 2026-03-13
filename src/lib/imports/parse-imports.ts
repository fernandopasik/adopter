import { isImportDeclaration, type SourceFile, type Statement } from 'typescript';
import { addImport, type Import } from './imports.ts';
import parseImport from './parse-import.ts';

const parseImports = (source: SourceFile, filePath: string): Import[] => {
  const { statements } = source;
  const imports: Import[] = [];

  Array.from(statements).forEach((statement: Statement): void => {
    if (isImportDeclaration(statement)) {
      const parsedImport = parseImport(statement, filePath);

      addImport(parsedImport);

      imports.push(parsedImport);
    }
  });

  return imports;
};

export default parseImports;
