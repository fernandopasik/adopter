import yargs from 'yargs';
import run from './run.js';

const cli = async (processArgs: readonly string[]): Promise<void> => {
  const { _: argList, rootDir } = yargs(processArgs)
    .usage('$0 [options] package1 [package2] [packageN]')
    .demandCommand(1, 'You need to provide at least one package to track')
    .option('rootDir', {
      default: '.',
      describe: 'Root directory containing files for tracking packages',
      type: 'string',
    })
    .option('srcMatch', {
      array: true,
      default: ['**/*.[jt]s?(x)'],
      describe: 'Glob patterns to match files for tracking packages',
      type: 'array',
    })
    .parseSync();
  const packages = argList.map((arg) => String(arg));

  await run({ packages, rootDir });
};

export default cli;
