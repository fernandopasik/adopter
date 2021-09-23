import path from 'path';
import type { ReadonlyDeep } from 'type-fest';
import { listFiles, processFiles } from './files/index.js';
import { getPackageExports } from './packages/index.js';
import { Coverage, Usage } from './reports/index.js';

export interface Options {
  packages: string[];
  rootDir?: string;
  srcMatch?: string[];
}

const run = async (options: ReadonlyDeep<Options>): Promise<void> => {
  const { packages, rootDir = '.', srcMatch = ['**/*.[jt]s?(x)'] } = options;

  const filesMatch = srcMatch.map((srcM) => path.join(rootDir, srcM));

  const packageExports = await getPackageExports(packages);

  const usage = new Usage(packageExports);
  const coverage = new Coverage(usage);

  processFiles(listFiles(filesMatch), (filePath, _filename, _content, _ast, imports = []) => {
    usage.addImports(filePath, imports);
    coverage.addFile(filePath, imports);
  });

  usage.print();
  coverage.print();
};

export default run;
