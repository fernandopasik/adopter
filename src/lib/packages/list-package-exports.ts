import log from 'loglevel';
import resolvePackage from './resolve-package.js';

export interface Export {
  name: string;
  type: string;
}

export const listPackageExports = async (packageName: string): Promise<Export[] | null> => {
  let pkg: Record<string, unknown> = {};

  try {
    const packageUrl = await resolvePackage(packageName);

    pkg = (await import(packageUrl)) as Record<string, unknown>;
  } catch (error: unknown) {
    const { message } = error as { message: string };
    log.warn(message);
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
