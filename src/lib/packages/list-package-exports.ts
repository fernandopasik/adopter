import log from 'loglevel';
import { yellow } from 'nanocolors';
import type { ReadonlyDeep } from 'type-fest';
import resolvePackage from './resolve-package.js';

export interface Export {
  name: string;
  type: string;
}

const listPackageExports = async (packageName: string): Promise<Export[] | null> =>
  resolvePackage(packageName)
    .then(async (packageUrl) => import(packageUrl) as Promise<Record<string, unknown>>)
    .then((pkg: ReadonlyDeep<Record<string, unknown>>) =>
      Object.entries(pkg).map(
        ([name, value]: Readonly<[string, unknown]>): Export => ({
          name,
          type: typeof value,
        }),
      ),
    )
    .catch((error) => {
      const { message } = error as { message: string };
      log.warn(yellow(message));
      return null;
    });

export default listPackageExports;
