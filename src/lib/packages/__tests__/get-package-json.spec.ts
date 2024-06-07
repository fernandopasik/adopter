import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import fs from 'fs';
import log from 'loglevel';
import extractPackagePath from '../extract-package-path.js';
import getPackageJson from '../get-package-json.js';
import resolvePackage from '../resolve-package.js';

jest.mock('../extract-package-path.js');
jest.mock('../resolve-package.js', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);
jest.mock('fs');
jest.mock('loglevel');

describe('get package.json', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
    jest.clearAllMocks();
  });

  it('resolves from package name', async () => {
    const packageName = 'typescript';

    await getPackageJson(packageName);

    expect(resolvePackage).toHaveBeenCalledTimes(1);
    expect(resolvePackage).toHaveBeenCalledWith(packageName);
  });

  it('extracts package path from main module url', async () => {
    const packageName = 'typescript';
    const packageUrl = '/home/project/node_modules/typescript';
    const mainModuleUrl = `${packageUrl}/lib/main.js`;
    (resolvePackage as jest.MockedFunction<typeof resolvePackage>).mockResolvedValueOnce(
      mainModuleUrl,
    );

    await getPackageJson(packageName);

    expect(extractPackagePath).toHaveBeenCalledTimes(1);
    expect(extractPackagePath).toHaveBeenCalledWith(mainModuleUrl, packageName);
  });

  it('reads package.json file', async () => {
    const packageName = 'typescript';
    const packagePath = '/home/project/node_modules/typescript';
    (extractPackagePath as jest.MockedFunction<typeof extractPackagePath>).mockReturnValueOnce(
      packagePath,
    );
    const spy = jest.spyOn(fs, 'readFileSync');

    await getPackageJson(packageName);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(`${packagePath}/package.json`);

    spy.mockRestore();
  });

  it('returns the package.json content', async () => {
    const pkgJson = { name: 'typescript' };
    const spy = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(pkgJson));

    await expect(getPackageJson('typescript')).resolves.toStrictEqual(pkgJson);

    spy.mockRestore();
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation();
    const errorMessage = 'Cannot find module';
    (resolvePackage as jest.MockedFunction<typeof resolvePackage>).mockRejectedValueOnce({
      message: errorMessage,
    });

    const packageJson = await getPackageJson('typescript');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(errorMessage);
    expect(packageJson).toBeNull();

    spy.mockRestore();
  });
});
