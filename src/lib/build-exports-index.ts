import { findMissingPackages, installPackages, listPackageExports } from './packages/index.js';

const buildExportsIndex = async (
  packages: readonly string[] = [],
): Promise<Record<string, Record<string, string>>> => {
  const missingImports = await findMissingPackages(packages);

  if (missingImports.length > 0) {
    await installPackages(packages);
  }

  const exportResults = await Promise.all(
    packages.map(async (packageName: string) => listPackageExports(packageName)),
  );

  return Object.fromEntries(
    exportResults.map((packageExports: Readonly<Record<string, string>>, index) => [
      packages[index],
      packageExports,
    ]),
  );
};

export default buildExportsIndex;
