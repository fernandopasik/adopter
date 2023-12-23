import chalk from 'chalk';
import { readFileSync } from 'fs';
import log from 'loglevel';
import type { PackageJson } from 'type-fest';
import extractPackagePath from './extract-package-path.js';
import resolvePackage from './resolve-package.js';

const getPackageJson = async (packageName: string): Promise<PackageJson | null> =>
  resolvePackage(packageName)
    .then((mainModuleUrl) => {
      const packagePath = extractPackagePath(mainModuleUrl, packageName);
      const packageJsonPath = `${packagePath}/package.json`;
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      return JSON.parse(readFileSync(packageJsonPath).toString()) as PackageJson;
    })
    .catch((error) => {
      const { message } = error as { message: string };
      log.warn(chalk.yellow(message));
      return null;
    });

export default getPackageJson;
