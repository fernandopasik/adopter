import type { PackageJson, ReadonlyDeep } from 'type-fest';

const filterTrackedDependencies = (
  packageJson: ReadonlyDeep<PackageJson>,
  trackedPackageNames: readonly string[] = [],
): Map<string, string> => {
  const deps = new Map<string, string>();

  const { dependencies = {}, peerDependencies = {} } = packageJson;
  const allDependencies = { ...dependencies, ...peerDependencies };

  Object.entries(allDependencies).forEach(([packageName, version]: Readonly<[string, string]>) => {
    if (trackedPackageNames.includes(packageName)) {
      deps.set(packageName, version);
    }
  });

  return deps;
};

export default filterTrackedDependencies;
