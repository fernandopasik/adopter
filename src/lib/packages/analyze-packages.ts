/* eslint-disable max-lines-per-function */
import chalk from 'chalk';
import ProgressBar from 'progress';
import { addPackage } from './packages.js';
import setPackageDependencies from './set-package-dependencies.js';
import setPackageMods from './set-package-mods.js';

const analyzePackages = async (packageList: string[]): Promise<void> => {
  const sortedList = [...packageList].sort((a, b) => a.localeCompare(b));

  const progressBar = new ProgressBar(`Analyzing packages [${chalk.blue(':bar')}] :percent`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    total: packageList.length * 2,
  });

  sortedList.forEach((packageName) => {
    addPackage(packageName);
  });

  await sortedList.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev.then(async () => {
        progressBar.tick(1);
        return setPackageMods(packageName);
      }),
    Promise.resolve(),
  );

  await sortedList.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev.then(async () => {
        progressBar.tick(1);
        return setPackageDependencies(packageName);
      }),
    Promise.resolve(),
  );
};

export default analyzePackages;
