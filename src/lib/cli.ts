import yargs from 'yargs';
import run from './run.js';

const cli = async (processArgs: readonly string[]): Promise<void> => {
  const { _: argList, rootDir } = yargs(processArgs)
    .usage('$0 [options] package1 [package2] [packageN]')
    .demandCommand(1, 'You need to provide at least one package to track')
    .string('rootDir')
    .parseSync();
  const packages = argList.map((arg) => String(arg));

  await run({ packages, rootDir });
};

export default cli;
