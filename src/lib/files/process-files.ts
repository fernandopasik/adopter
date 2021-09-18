import fs from 'fs';
import path from 'path';
import type ts from 'typescript';
import type { Import } from '../imports/index.js';
import { parseImports } from '../imports/index.js';
import parseAst from './parse-ast.js';

const processFiles = (
  filePaths: readonly string[] = [],
  callback?: (
    filePath: string,
    filename: string,
    content: string,
    ast?: ts.SourceFile,
    imports?: Import[],
  ) => void,
): void => {
  filePaths.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    const ast = parseAst(filename, content);

    const imports = typeof ast === 'undefined' ? undefined : parseImports(ast);

    if (typeof callback === 'function') {
      callback(filePath, filename, content, ast, imports);
    }
  });
};

export default processFiles;
