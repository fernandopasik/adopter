export const listPackageExports = async (packageName: string): Promise<Record<string, string>> => {
  const pkg = (await import(packageName)) as Record<string, unknown>;

  const pkgExports = Object.entries(pkg);

  const pkgExportsTypes = pkgExports.map(
    ([pkgName, value]: Readonly<[string, unknown]>): string[] => [pkgName, typeof value],
  );

  return Object.fromEntries(pkgExportsTypes) as Record<string, string>;
};

export default listPackageExports;
