import type { ReadonlyDeep } from 'type-fest';
import { listFiles } from './files/index.js';
import type { Import } from './imports/index.js';
import processFiles from './process-files.js';

export interface Options {
  packages: string[];
  rootDir?: string;
  srcMatch?: string[];
  srcIgnorePatterns?: string[];
}

const DEFAULT_OPTIONS: Options = {
  packages: [],
  rootDir: process.cwd(),
  srcMatch: ['**/*.[j|t]s'],
  srcIgnorePatterns: ['/(node_modules|.yarn)/'],
};

const run = ({ packages, srcMatch }: ReadonlyDeep<Options> = DEFAULT_OPTIONS): void => {
  const allImports: Import[] = [];

  processFiles(listFiles(srcMatch), (_filePath, _filename, _content, ast, imports = []) => {
    if (typeof ast !== 'undefined') {
      allImports.push(...imports);
    }
  });

  console.log(allImports);
  console.log(packages);
};

export default run;
