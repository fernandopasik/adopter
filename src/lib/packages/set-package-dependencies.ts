import filterTrackedDependencies from './filter-tracked-dependencies.js';
import getPackageJson from './get-package-json.js';
import { getPackage, getPackageNames } from './packages.js';

const setPackageDependencies = async (name: string): Promise<void> => {
  const pkg = getPackage(name);

  if (typeof pkg !== 'undefined') {
    const packageJson = await getPackageJson(name);
    const packageList = Array.from(getPackageNames());

    if (packageJson !== null) {
      pkg.isInstalled = true;
      const dependencies = filterTrackedDependencies(packageJson, packageList);

      dependencies.forEach(({ name: dependencyName }: Readonly<{ name: string }>) => {
        const dependency = getPackage(dependencyName);
        if (typeof dependency !== 'undefined') {
          dependency.dependants.add(pkg);
          pkg.dependencies.add(dependency);
        }
      });
    }
  }
};

export default setPackageDependencies;
