import log from 'loglevel';
import path from 'path';
import type { ReadonlyDeep } from 'type-fest';
import { listFiles, processFiles } from './files/index.js';
import { getPackagesExports } from './packages/index.js';
import { Coverage, Usage } from './reports/index.js';

export interface Options {
  packages: string[];
  rootDir?: string;
  srcMatch?: string[];
}

log.setDefaultLevel('ERROR');

const run = async (options: ReadonlyDeep<Options>): Promise<void> => {
  const { packages, rootDir = '.', srcMatch = ['**/*.[jt]s?(x)'] } = options;

  const filesMatch = srcMatch.map((srcM) => path.join(rootDir, srcM));

  const packagesExports = await getPackagesExports(packages);

  const usage = new Usage(packagesExports);
  const coverage = new Coverage(usage);

  processFiles(listFiles(filesMatch), (filePath, _filename, _content, _ast, imports = []) => {
    usage.addImports(filePath, imports);
    coverage.addFile(filePath, imports);
  });

  usage.print();
  coverage.print();
};

export default run;
