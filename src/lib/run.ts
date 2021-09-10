import type { ReadonlyDeep } from 'type-fest';
import buildExportsIndex from './build-exports-index.js';
import type { Import } from './imports/index.js';
import { parseImports } from './imports/index.js';
import listFiles from './list-files.js';
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

const run = async ({
  packages,
  srcMatch,
}: ReadonlyDeep<Options> = DEFAULT_OPTIONS): Promise<void> => {
  const exportsIndex = await buildExportsIndex(packages);
  const imports: Import[] = [];

  processFiles(listFiles(srcMatch), (_filePath, _filename, _content, ast) => {
    if (typeof ast !== 'undefined') {
      imports.push(...parseImports(ast));
    }
  });

  console.log(imports);
  console.log(exportsIndex);
};

export default run;
