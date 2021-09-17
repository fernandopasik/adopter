import type { ReadonlyDeep } from 'type-fest';
import { listFiles } from './files/index.js';
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
  processFiles(listFiles(srcMatch), (_filePath, _filename, _content, _ast, imports = []) => {
    console.log(imports);
  });

  console.log(packages);
};

export default run;
