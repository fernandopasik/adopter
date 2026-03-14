import fs from 'node:fs';
import path from 'node:path';
import type { SourceFile } from 'typescript';
import { parseImports, type Import } from '../imports/index.ts';
import { addFile, addFileImports } from './files.ts';
import parseAst from './parse-ast.ts';

// eslint-disable-next-line @typescript-eslint/max-params
export type Callback = (
  filePath: string,
  filename: string,
  content?: string,
  ast?: SourceFile,
  imports?: Import[],
) => void;

const processFiles = (filePaths: string[] = [], callback?: Callback): void => {
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
