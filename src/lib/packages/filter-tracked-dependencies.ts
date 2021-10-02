import type { PackageJson, ReadonlyDeep } from 'type-fest';

export interface Dependency {
  name: string;
  version: string;
}

const filterTrackedDependencies = (
  packageJson: ReadonlyDeep<PackageJson>,
  trackedPackageNames: readonly string[] = [],
): Dependency[] => {
  const { dependencies = {}, peerDependencies = {} } = packageJson;
  const allDependencies = { ...dependencies, ...peerDependencies };

  const list = Object.entries(allDependencies)
    .map(([packageName, version]: Readonly<[string, string]>) => ({
      name: packageName,
      version,
    }))
    .filter(({ name }: Readonly<Dependency>) => trackedPackageNames.includes(name));

  return list;
};

export default filterTrackedDependencies;
