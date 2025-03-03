/* eslint-disable max-lines-per-function */
import fs from 'fs';
import path from 'path';
import type ts from 'typescript';
import { parseImports, type Import } from '../imports/index.js';
import { addFile, addFileImports } from './files.js';
import parseAst from './parse-ast.js';

const processFiles = (
  filePaths: string[] = [],
  // eslint-disable-next-line @typescript-eslint/max-params
  callback?: (
    filePath: string,
    filename: string,
    content: string,
    ast?: ts.SourceFile,
    imports?: Import[],
  ) => void,
): void => {
  filePaths.forEach((filePath) => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    const ast = parseAst(filename, content);

    const imports = typeof ast === 'undefined' ? undefined : parseImports(ast, filePath);

    addFile(filePath);
    addFileImports(filePath, imports);

    if (typeof callback === 'function') {
      callback(filePath, filename, content, ast, imports);
    }
  });
};

export default processFiles;
