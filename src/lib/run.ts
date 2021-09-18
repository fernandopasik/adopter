import type { ReadonlyDeep } from 'type-fest';
import { listFiles, processFiles } from './files/index.js';
import { getPackageExports } from './packages/index.js';
import { Usage } from './reports/index.js';

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
  const packageExports = await getPackageExports(packages);

  const usage = new Usage(packageExports);

  processFiles(listFiles(srcMatch), (filePath, _filename, _content, _ast, imports = []) => {
    usage.addImports(filePath, imports);
  });

  // eslint-disable-next-line @typescript-eslint/dot-notation
  console.log(usage['storage']);
};

export default run;
