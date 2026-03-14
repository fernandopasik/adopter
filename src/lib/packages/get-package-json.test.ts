import { beforeEach, describe, it, jest } from '@jest/globals';
import fs from 'fs';
import log from 'loglevel';
import assert from 'node:assert/strict';
import extractPackagePath from './extract-package-path.ts';
import getPackageJson from './get-package-json.ts';
import resolvePackage from './resolve-package.ts';

jest.mock('./extract-package-path.ts');
jest.mock('./resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);
jest.mock('fs');
jest.mock('loglevel');

const extractPackagePathMock = jest.mocked(extractPackagePath);
const resolvePackageMock = jest.mocked(resolvePackage);

describe('get package.json', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
    jest.clearAllMocks();
  });

  it('resolves from package name', async () => {
    const packageName = 'typescript';

    await getPackageJson(packageName);

    assert.strictEqual(resolvePackageMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(resolvePackageMock.mock.calls.at(0), [packageName]);
  });

  it('extracts package path from main module url', async () => {
    const packageName = 'typescript';
    const packageUrl = '/home/project/node_modules/typescript';
    const mainModuleUrl = `${packageUrl}/lib/main.js`;
    jest.mocked(resolvePackage).mockResolvedValueOnce(mainModuleUrl);

    await getPackageJson(packageName);

    assert.strictEqual(extractPackagePathMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(extractPackagePathMock.mock.calls.at(0), [packageName]);
  });

  it('reads package.json file', async () => {
    const packageName = 'typescript';
    const packagePath = '/home/project/node_modules/typescript';
    jest.mocked(extractPackagePath).mockReturnValueOnce(packagePath);
    const spy = jest.spyOn(fs, 'readFileSync');

    await getPackageJson(packageName);

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), [`${packagePath}/package.json`]);

    spy.mockRestore();
  });

  it('returns the package.json content', async () => {
    const pkgJson = { name: 'typescript' };
    const spy = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(pkgJson));

    assert.deepStrictEqual(await getPackageJson('typescript'), pkgJson);

    spy.mockRestore();
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation(jest.fn<typeof log.warn>());
    const errorMessage = 'Cannot find module';
    jest.mocked(resolvePackage).mockRejectedValueOnce({ message: errorMessage });

    const packageJson = await getPackageJson('typescript');

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), [errorMessage]);
    assert.strictEqual(packageJson, null);

    spy.mockRestore();
  });
});
