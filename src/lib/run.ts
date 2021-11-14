/* eslint-disable max-lines-per-function */
import chalk from 'chalk';
import log from 'loglevel';
import path from 'path';
import ProgressBar from 'progress';
import type { ReadonlyDeep } from 'type-fest';
import type ts from 'typescript';
import { listFiles, processFiles } from './files/index.js';
import type { Import } from './imports/index.js';
import { analyzePackages } from './packages/index.js';
import * as coverage2 from './reports/coverage/index.js';
import { Coverage, print, Usage } from './reports/index.js';
import * as usage2 from './reports/usage/index.js';

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
  srcIgnoreMatch?: string[];
  srcMatch?: string[];
  debug?: boolean;
}

const run = async (options: ReadonlyDeep<Options>): Promise<void> => {
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

  await analyzePackages(packages);

  const usage = new Usage(packages);
  const coverage = new Coverage(usage);

  log.debug('Loading packages and modules');
  await usage.init();
  log.debug('Loaded packages and modules');

  const files = listFiles(filesMatch.concat(filesIgnoreMatch));
  const total = files.length;

  const progressBar = new ProgressBar(`[${chalk.blue(':bar')}] :percent`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total,
  });

  log.debug('Processing files');
  processFiles(files, (filePath, filename, content, ast, imports = []) => {
    log.debug('Processing file', filePath);
    usage.addImports(imports);
    coverage.addFile(filePath, imports);

    if (typeof onFile === 'function') {
      onFile(filePath, filename, content, ast, imports);
    }

    if (log.getLevel() > 1) {
      progressBar.tick(1);
    }
    log.debug('Processed file', filePath);
  });

  log.debug('Printing reports');

  print(usage2.text());

  if (displayCoverage) {
    print(coverage2.text());
  }
  log.debug('Printed reports');
  log.debug('End of run');
};

export default run;
