export interface Export {
  name: string;
  type: string;
}

export const listPackageExports = async (packageName: string): Promise<Export[] | null> => {
  let pkg: Record<string, unknown> = {};

  try {
    pkg = (await import(packageName)) as Record<string, unknown>;
  } catch {
    return null;
  }

  const pkgExports = Object.entries(pkg);

  return pkgExports.map(
    ([name, value]: Readonly<[string, unknown]>): Export => ({
      name,
      type: typeof value,
    }),
  );
};

export default listPackageExports;
