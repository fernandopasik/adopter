import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('analyze packages', async () => {
  const addPackageMock = mock.fn();
  const setPackageDependenciesMock = mock.fn();
  const setPackageModsMock = mock.fn();

  const packagesModule = mock.module('./packages.ts', {
    namedExports: { addPackage: addPackageMock },
  });
  const setPackageDependenciesModule = mock.module('./set-package-dependencies.ts', {
    defaultExport: setPackageDependenciesMock,
  });
  const setPackageModsModule = mock.module('./set-package-mods.ts', {
    defaultExport: setPackageModsMock,
  });

  const analyzePackages = (await import('./analyze-packages.ts')).default;

  beforeEach(() => {
    addPackageMock.mock.resetCalls();
    setPackageDependenciesMock.mock.resetCalls();
    setPackageModsMock.mock.resetCalls();
  });

  after(() => {
    packagesModule.restore();
    setPackageDependenciesModule.restore();
    setPackageModsModule.restore();
  });

  it('adds each package', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(addPackageMock.mock.calls.length, 2);
    assert.deepStrictEqual(addPackageMock.mock.calls.at(0)?.arguments, ['example1']);
    assert.deepStrictEqual(addPackageMock.mock.calls.at(1)?.arguments, ['example2']);
  });

  it('sets each package modules', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(setPackageModsMock.mock.calls.length, 2);
    assert.deepStrictEqual(setPackageModsMock.mock.calls.at(0)?.arguments, ['example1']);
    assert.deepStrictEqual(setPackageModsMock.mock.calls.at(1)?.arguments, ['example2']);
  });

  it('sets each package dependencies', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    assert.strictEqual(setPackageDependenciesMock.mock.calls.length, 2);
    assert.deepStrictEqual(setPackageDependenciesMock.mock.calls.at(0)?.arguments, ['example1']);
    assert.deepStrictEqual(setPackageDependenciesMock.mock.calls.at(1)?.arguments, ['example2']);
  });
});
