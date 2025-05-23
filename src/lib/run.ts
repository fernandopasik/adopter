/* eslint-disable max-lines-per-function */

import chalk from 'chalk';
import log from 'loglevel';
import path from 'path';
import ProgressBar from 'progress';
import type ts from 'typescript';
import { listFiles, processFiles } from './files/index.js';
import type { Import } from './imports/index.js';
import { analyzePackages } from './packages/index.js';
import { coverage, print, usage } from './reports/index.js';

export interface Options {
  coverage?: boolean;
  // eslint-disable-next-line @typescript-eslint/max-params
  onFile?: (
    filePath: string,
    filename: string,
    content: string,
    ast?: ts.SourceFile,
    imports?: Import[],
  ) => void;
  packages: string[];
  rootDir?: string;
  srcIgnoreMatch?: string[];
  srcMatch?: string[];
  debug?: boolean;
}

const run = async (options: Options): Promise<void> => {
  const {
    coverage: displayCoverage = false,
    debug = false,
    onFile,
    packages,
    rootDir = '.',
    srcIgnoreMatch = [],
    srcMatch = ['**/*.[jt]s?(x)'],
  } = options;

  log.setDefaultLevel(debug ? 'DEBUG' : 'ERROR');

  log.debug('Start run');

  const filesMatch = srcMatch.map((srcM) => path.join(rootDir, srcM));
  const filesIgnoreMatch = srcIgnoreMatch.map((srcM) => `!${path.join(rootDir, srcM)}`);

  log.debug('Loading packages and modules');
  await analyzePackages(packages);
  log.debug('Loaded packages and modules');

  const files = listFiles(filesMatch.concat(filesIgnoreMatch));
  const total = files.length;

  const progressBar = new ProgressBar(`Processing files   [${chalk.blue(':bar')}] :percent`, {
    complete: '=',
    incomplete: ' ',
    total,
    width: 30,
  });

  log.debug('Processing files');
  // eslint-disable-next-line @typescript-eslint/max-params
  processFiles(files, (filePath, filename, content, ast, imports = []) => {
    log.debug('Processing file', filePath);

    if (typeof onFile === 'function') {
      onFile(filePath, filename, content, ast, imports);
    }

    if (log.getLevel() > 1) {
      progressBar.tick(1);
    }
    log.debug('Processed file', filePath);
  });

  log.debug('Printing reports');

  print(usage.text());

  if (displayCoverage) {
    print(coverage.text());
  }
  log.debug('Printed reports');
  log.debug('End of run');
};

export default run;
