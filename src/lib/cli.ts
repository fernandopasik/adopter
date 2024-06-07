import yargs, { type Options } from 'yargs';
import run from './run.js';

const MAX_FORMAT_WIDTH = 120;

const OPTIONS: Record<string, Options> = {
  coverage: {
    default: false,
    describe: 'Report file coverage',
    type: 'boolean',
  },
  debug: {
    default: false,
    describe: 'Display debugging information',
    type: 'boolean',
  },
  rootDir: {
    default: '.',
    describe: 'Root directory containing files for tracking packages',
    type: 'string',
  },
  srcIgnoreMatch: {
    default: [],
    describe: 'Glob patterns to ignore files for tracking packages',
    type: 'array',
  },
  srcMatch: {
    default: ['**/*.[jt]s?(x)'],
    describe: 'Glob patterns to match files for tracking packages',
    type: 'array',
  },
};

const cli = async (processArgs: string[]): Promise<void> => {
  const { _: argList, ...options } = yargs(processArgs)
    // eslint-disable-next-line @typescript-eslint/naming-convention
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
