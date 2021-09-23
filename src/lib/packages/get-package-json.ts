import log from 'loglevel';
import { yellow } from 'nanocolors';
import type { Mutable, PackageJson, ReadonlyDeep } from 'type-fest';
import resolvePackage from './resolve-package.js';

const getPackageJson = async (packageName: string): Promise<PackageJson | null> =>
  resolvePackage(`${packageName}/package.json`)
    .then(async (packageJsonUrl) => import(packageJsonUrl) as Promise<{ default: PackageJson }>)
    .then(
      ({ default: packageJson }: ReadonlyDeep<{ default: PackageJson }>) =>
        packageJson as Mutable<PackageJson>,
    )
    .catch((error) => {
      const { message } = error as { message: string };
      log.warn(yellow(message));
      return null;
    });

export default getPackageJson;
