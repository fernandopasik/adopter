import { addPackage } from './packages.js';
import setPackageDependencies from './set-package-dependencies.js';
import setPackageMods from './set-package-mods.js';

const analyzePackages = async (packageList: readonly string[]): Promise<void> => {
  const sortedList = [...packageList].sort((a, b) => a.localeCompare(b));

  sortedList.forEach((packageName) => {
    addPackage(packageName);
  });

  await sortedList.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev.then(async () => setPackageMods(packageName)),
    Promise.resolve(),
  );

  await sortedList.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev.then(async () => setPackageDependencies(packageName)),
    Promise.resolve(),
  );
};

export default analyzePackages;
