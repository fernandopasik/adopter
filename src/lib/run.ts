import log from 'loglevel';
import path from 'path';
import type { ReadonlyDeep } from 'type-fest';
import type ts from 'typescript';
import { listFiles, processFiles } from './files/index.js';
import type { Import } from './imports/index.js';
import { Coverage, Usage } from './reports/index.js';

export interface Options {
  coverage?: boolean;
  onFile?: (
    filePath: string,
    filename: string,
    content: string,
    ast?: ts.SourceFile,
    imports?: Import[],
  ) => void;
  packages: string[];
  rootDir?: string;
  srcMatch?: string[];
}

log.setDefaultLevel('ERROR');

// eslint-disable-next-line max-lines-per-function
const run = async (options: ReadonlyDeep<Options>): Promise<void> => {
  const {
    coverage: displayCoverage = false,
    onFile,
    packages,
    rootDir = '.',
    srcMatch = ['**/*.[jt]s?(x)'],
  } = options;

  const filesMatch = srcMatch.map((srcM) => path.join(rootDir, srcM));

  const usage = new Usage(packages);
  const coverage = new Coverage(usage);

  await usage.init();

  processFiles(listFiles(filesMatch), (filePath, filename, content, ast, imports = []) => {
    usage.addImports(imports);
    coverage.addFile(filePath, imports);

    if (typeof onFile === 'function') {
      onFile(filePath, filename, content, ast, imports);
    }
  });

  usage.print();
  if (displayCoverage) {
    coverage.print();
  }
};

export default run;
