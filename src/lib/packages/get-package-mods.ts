import log from 'loglevel';
import { yellow } from 'nanocolors';
import type { ReadonlyDeep } from 'type-fest';
import resolvePackage from './resolve-package.js';

const getPackageModules = async (packageName: string): Promise<string[] | null> =>
  resolvePackage(packageName)
    .then(async (packageUrl) => import(packageUrl) as Promise<Record<string, unknown>>)
    .then((pkg: ReadonlyDeep<Record<string, unknown>>) => Object.keys(pkg))
    .catch((error) => {
      const { message } = error as { message: string };
      log.warn(yellow(message));
      return null;
    });

export default getPackageModules;
