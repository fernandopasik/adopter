import chalk from 'chalk';
import log from 'loglevel';
import resolvePackage from './resolve-package.js';

const getPackageModules = async (packageName: string): Promise<string[] | null> =>
  resolvePackage(packageName)
    .then(async (packageUrl) => import(packageUrl) as Promise<Record<string, unknown>>)
    .then((pkg: Record<string, unknown>) =>
      Object.keys(pkg).filter((pkgName) => pkgName !== '__esModule'),
    )
    .catch((error) => {
      const { message } = error as { message: string };
      log.warn(chalk.yellow(message));
      return null;
    });

export default getPackageModules;
