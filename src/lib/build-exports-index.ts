import type { ReadonlyDeep } from 'type-fest';
import type { Export } from './packages/index.js';
import { findMissingPackages, installPackages, listPackageExports } from './packages/index.js';

const buildExportsIndex = async (
  packages: readonly string[] = [],
): Promise<Record<string, ReadonlyDeep<Export[]>>> => {
  const missingImports = await findMissingPackages(packages);

  if (missingImports.length > 0) {
    await installPackages(packages);
  }

  const exportResults = await Promise.all(
    packages.map(async (packageName: string) => listPackageExports(packageName)),
  );

  return Object.fromEntries(
    exportResults.map((packageExports: ReadonlyDeep<Export[]>, index) => [
      packages[index],
      packageExports,
    ]),
  );
};

export default buildExportsIndex;
