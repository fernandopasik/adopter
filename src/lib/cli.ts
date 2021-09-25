import yargs from 'yargs';
import run from './run.js';

const MAX_FORMAT_WIDTH = 120;

// eslint-disable-next-line max-lines-per-function
const cli = async (processArgs: readonly string[]): Promise<void> => {
  const {
    _: argList,
    coverage,
    rootDir,
  } = yargs(processArgs)
    .usage('$0 [options] package1 [package2] [packageN]')
    .demandCommand(1, 'You need to provide at least one package to track')
    .option('coverage', {
      default: false,
      describe: 'Report file coverage',
      type: 'boolean',
    })
    .option('rootDir', {
      default: '.',
      describe: 'Root directory containing files for tracking packages',
      type: 'string',
    })
    .option('srcMatch', {
      default: ['**/*.[jt]s?(x)'],
      describe: 'Glob patterns to match files for tracking packages',
      type: 'array',
    })
    .wrap(MAX_FORMAT_WIDTH)
    .parseSync();

  const packages = argList.map((arg) => String(arg));

  await run({ coverage, packages, rootDir });
};

export default cli;
