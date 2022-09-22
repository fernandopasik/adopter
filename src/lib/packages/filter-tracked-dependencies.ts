import type { PackageJson } from 'type-fest';

export interface Dependency {
  name: string;
  version: string | undefined;
}

const filterTrackedDependencies = (
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  packageJson: PackageJson,
  trackedPackageNames: readonly string[] = [],
): Dependency[] => {
  const { dependencies = {}, peerDependencies = {} } = packageJson;
  const allDependencies = { ...dependencies, ...peerDependencies };

  const list = Object.entries(allDependencies)
    .map(([packageName, version]: Readonly<[string, string | undefined]>) => ({
      name: packageName,
      version,
    }))
    .filter(({ name }: Readonly<Dependency>) => trackedPackageNames.includes(name));

  return list;
};

export default filterTrackedDependencies;
