import yargs from 'yargs';
import run from './run.js';

const MAX_FORMAT_WIDTH = 120;

const DESC: Record<string, string> = {
  coverage: 'Report file coverage',
  rootDir: 'Root directory containing files for tracking packages',
  srcMatch: 'Glob patterns to match files for tracking packages',
};

const cli = async (processArgs: readonly string[]): Promise<void> => {
  const {
    _: argList,
    coverage,
    rootDir,
    srcMatch,
  } = yargs(processArgs)
    .usage('$0 [options] package1 [package2] [packageN]')
    .demandCommand(1, 'You need to provide at least one package to track')
    .option('coverage', { describe: DESC.coverage, default: false, type: 'boolean' })
    .option('rootDir', { describe: DESC.rootDir, default: '.', type: 'string' })
    .option('srcMatch', { describe: DESC.srcMatch, default: ['**/*.[jt]s?(x)'], type: 'array' })
    .wrap(MAX_FORMAT_WIDTH)
    .parseSync();

  const packages = argList.map((arg) => String(arg));

  await run({ coverage, packages, rootDir, srcMatch });
};

export default cli;
