import fs from 'fs';
import path from 'path';
import type ts from 'typescript';
import parseAst from './parse-ast.js';

const processFiles = (
  filePaths: readonly string[] = [],
  callback?: (filePath: string, filename: string, content: string, ast?: ts.SourceFile) => void,
): void => {
  filePaths.forEach((filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');

    const filename = path.basename(filePath);

    if (typeof callback === 'function') {
      callback(filePath, filename, content, parseAst(filename, content));
    }
  });
};

export default processFiles;
