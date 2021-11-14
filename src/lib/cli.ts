import type { Options } from 'yargs';
import yargs from 'yargs';
import run from './run.js';

const MAX_FORMAT_WIDTH = 120;

const OPTIONS: Record<string, Options> = {
  coverage: {
    describe: 'Report file coverage',
    default: false,
    type: 'boolean',
  },
  debug: {
    describe: 'Display debugging information',
    default: false,
    type: 'boolean',
  },
  rootDir: {
    describe: 'Root directory containing files for tracking packages',
    default: '.',
    type: 'string',
  },
  srcIgnoreMatch: {
    describe: 'Glob patterns to ignore files for tracking packages',
    default: [],
    type: 'array',
  },
  srcMatch: {
    describe: 'Glob patterns to match files for tracking packages',
    default: ['**/*.[jt]s?(x)'],
    type: 'array',
  },
};

const cli = async (processArgs: readonly string[]): Promise<void> => {
  const { _: argList, ...options } = yargs(processArgs)
    .parserConfiguration({ 'greedy-arrays': false })
    .usage('$0 [options] package1 [package2] [packageN]')
    .demandCommand(1, 'You need to provide at least one package to track')
    .options(OPTIONS)
    .wrap(MAX_FORMAT_WIDTH)
    .parseSync();

  const packages = argList.map((arg) => String(arg));

  await run({ packages, ...options });
};

export default cli;
