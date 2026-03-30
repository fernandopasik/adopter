import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('get package.json', async () => {
  const extractPackagePathMock = mock.fn<() => string>();
  const readFileSyncMock = mock.fn<() => string>();
  const resolvePackageMock = mock.fn<() => Promise<string>>(async () => Promise.resolve(''));
  const warnMock = mock.fn<() => string>();

  const chalkModule = mock.module('chalk', {
    defaultExport: { yellow: mock.fn((txt: string) => txt) },
  });
  const extractPackagePathModule = mock.module('./extract-package-path.ts', {
    defaultExport: extractPackagePathMock,
  });
  const fsModule = mock.module('node:fs', { namedExports: { readFileSync: readFileSyncMock } });
  const loglevelModule = mock.module('loglevel', { namedExports: { warn: warnMock } });
  const resolvePackageModule = mock.module('./resolve-package.ts', {
    defaultExport: resolvePackageMock,
  });

  const getPackageJson = (await import('./get-package-json.ts')).default;

  beforeEach(() => {
    extractPackagePathMock.mock.resetCalls();
    readFileSyncMock.mock.resetCalls();
    resolvePackageMock.mock.resetCalls();
    warnMock.mock.resetCalls();
  });

  after(() => {
    chalkModule.restore();
    extractPackagePathModule.restore();
    fsModule.restore();
    loglevelModule.restore();
    resolvePackageModule.restore();
  });

  it('resolves from package name', async () => {
    const packageName = 'typescript';

    await getPackageJson(packageName);

    assert.strictEqual(resolvePackageMock.mock.calls.length, 1);
    assert.deepStrictEqual(resolvePackageMock.mock.calls.at(0)?.arguments, [packageName]);
  });

  it('extracts package path from main module url', async () => {
    const packageName = 'typescript';
    const packageUrl = '/home/project/node_modules/typescript';
    const mainModuleUrl = `${packageUrl}/lib/main.js`;

    resolvePackageMock.mock.mockImplementationOnce(async () => Promise.resolve(mainModuleUrl));

    await getPackageJson(packageName);

    assert.strictEqual(extractPackagePathMock.mock.calls.length, 1);
    assert.deepStrictEqual(extractPackagePathMock.mock.calls.at(0)?.arguments, [
      mainModuleUrl,
      packageName,
    ]);
  });

  it('reads package.json file', async () => {
    const packageName = 'typescript';
    const packagePath = '/home/project/node_modules/typescript';
    extractPackagePathMock.mock.mockImplementationOnce(() => packagePath);

    await getPackageJson(packageName);

    assert.strictEqual(readFileSyncMock.mock.calls.length, 1);
    assert.deepStrictEqual(readFileSyncMock.mock.calls.at(0)?.arguments, [
      `${packagePath}/package.json`,
    ]);
  });

  it('returns the package.json content', async () => {
    const pkgJson = { name: 'typescript' };

    readFileSyncMock.mock.mockImplementationOnce(() => JSON.stringify(pkgJson));

    assert.deepStrictEqual(await getPackageJson('typescript'), pkgJson);
  });

  it('with a non installed module', async () => {
    const errorMessage = 'Cannot find module';
    resolvePackageMock.mock.mockImplementationOnce(async () =>
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      Promise.reject({ message: errorMessage }),
    );

    const packageJson = await getPackageJson('typescript');

    assert.strictEqual(warnMock.mock.calls.length, 1);
    assert.deepStrictEqual(warnMock.mock.calls.at(0)?.arguments, [errorMessage]);
    assert.strictEqual(packageJson, null);
  });
});
