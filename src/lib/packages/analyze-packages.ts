/* eslint-disable max-lines-per-function */
import chalk from 'chalk';
import ProgressBar from 'progress';
import { addPackage } from './packages.js';
import setPackageDependencies from './set-package-dependencies.js';
import setPackageMods from './set-package-mods.js';

const analyzePackages = async (packageList: string[]): Promise<void> => {
  const sortedList = [...packageList].sort((first, second) => first.localeCompare(second));

  const progressBar = new ProgressBar(`Analyzing packages [${chalk.blue(':bar')}] :percent`, {
    complete: '=',
    incomplete: ' ',
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    total: packageList.length * 2,
    width: 30,
  });

  sortedList.forEach((packageName) => {
    addPackage(packageName);
  });

  await sortedList.reduce(
    async (prev: Promise<void>, packageName) =>
      prev.then(async () => {
        progressBar.tick(1);
        return setPackageMods(packageName);
      }),
    Promise.resolve(),
  );

  await sortedList.reduce(
    async (prev: Promise<void>, packageName) =>
      prev.then(async () => {
        progressBar.tick(1);
        return setPackageDependencies(packageName);
      }),
    Promise.resolve(),
  );
};

export default analyzePackages;
