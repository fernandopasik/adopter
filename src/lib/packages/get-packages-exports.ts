import type { ReadonlyDeep } from 'type-fest';
import type { Export } from './list-package-exports.js';
import listPackageExports from './list-package-exports.js';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type PackagesExports = Map<string, ReadonlyDeep<Export[]> | null>;

const getPackagesExports = async (packageNames: readonly string[]): Promise<PackagesExports> => {
  const packagesExports: PackagesExports = new Map();

  await packageNames.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev
        .then(async () => listPackageExports(packageName))
        .then((exports: ReadonlyDeep<Export[]> | null) => {
          packagesExports.set(packageName, exports);
        }),
    Promise.resolve(),
  );

  return packagesExports;
};

export default getPackagesExports;
