import type { PackageJson } from 'type-fest';

export interface Dependency {
  name: string;
  version: string | undefined;
}

const filterTrackedDependencies = (
  packageJson: PackageJson,
  trackedPackageNames: string[] = [],
): Dependency[] => {
  const { dependencies = {}, peerDependencies = {} } = packageJson;
  const allDependencies = { ...dependencies, ...peerDependencies };

  const list = Object.entries(allDependencies)
    .map(([packageName, version]: [string, string | undefined]) => ({
      name: packageName,
      version,
    }))
    .filter(({ name }: Dependency) => trackedPackageNames.includes(name));

  return list;
};

export default filterTrackedDependencies;
