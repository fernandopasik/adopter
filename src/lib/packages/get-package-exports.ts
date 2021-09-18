import type { ReadonlyDeep } from 'type-fest';
import type { Export } from './list-package-exports.js';
import listPackageExports from './list-package-exports.js';

// eslint-disable-next-line @typescript-eslint/no-type-alias
export type PackageExports = Map<string, ReadonlyDeep<Export[]>>;

const getPackageExports = async (packageNames: readonly string[]): Promise<PackageExports> => {
  const packageExports: PackageExports = new Map();

  await packageNames.reduce(
    async (prev: Readonly<Promise<void>>, packageName) =>
      prev
        .then(async () => listPackageExports(packageName))
        .then((exports: ReadonlyDeep<Export[]> | null) => {
          if (exports !== null) {
            packageExports.set(packageName, exports);
          }
        }),
    Promise.resolve(),
  );

  return packageExports;
};

export default getPackageExports;
