import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { Import } from '../../imports/index.ts';
import type { Package } from '../../packages/index.ts';

describe('package usage', async () => {
  const isModuleImportedMock = mock.fn<() => boolean>(() => false);
  const isPackageImportedMock = mock.fn<() => boolean>(() => false);
  const isPackageUsedMock = mock.fn<() => boolean>(() => false);
  const getPackageMock = mock.fn<() => Package | undefined>();

  const isPackageUSedModule = mock.module('./is-package-used.ts', {
    defaultExport: isPackageUsedMock,
  });
  const packagesModule = mock.module('../../packages/index.ts', {
    namedExports: {
      getPackage: getPackageMock,
      isModuleImported: isModuleImportedMock,
      isPackageImported: isPackageImportedMock,
    },
  });

  const packageUsage = (await import('./package-usage.ts')).default;

  beforeEach(() => {
    isModuleImportedMock.mock.resetCalls();
    isPackageImportedMock.mock.resetCalls();
    isPackageUsedMock.mock.resetCalls();
    getPackageMock.mock.resetCalls();
  });

  after(() => {
    isPackageUSedModule.restore();
    packagesModule.restore();
  });

  const pkg = {
    dependencies: new Set<Package>(),
    dependents: new Set<Package>(),
    imports: new Set<Import>(),
    isInstalled: true,
    modules: new Set<string>(),
    name: 'example',
  };

  it('get the package', () => {
    packageUsage('example');

    assert.strictEqual(getPackageMock.mock.calls.length, 1);
    assert.deepStrictEqual(getPackageMock.mock.calls.at(0)?.arguments, ['example']);
  });

  it('returns the package name', () => {
    const name = 'example';

    assert.partialDeepStrictEqual(packageUsage(name), { name });
  });

  it('returns if package is imported', () => {
    isPackageImportedMock.mock.mockImplementationOnce(() => true);
    const name = 'example';

    const usage = packageUsage(name);

    assert.strictEqual(isPackageImportedMock.mock.calls.length, 1);
    assert.deepStrictEqual(isPackageImportedMock.mock.calls.at(0)?.arguments, [name]);
    assert.partialDeepStrictEqual(usage, { isImported: true });
  });

  it('returns if package is used', () => {
    isPackageUsedMock.mock.mockImplementationOnce(() => true);
    const name = 'example';

    const usage = packageUsage(name);

    assert.strictEqual(isPackageUsedMock.mock.calls.length, 1);
    assert.deepStrictEqual(isPackageUsedMock.mock.calls.at(0)?.arguments, [name]);
    assert.partialDeepStrictEqual(usage, { isUsed: true });
  });

  it('tracks its modules', () => {
    const modules = new Set(['example1', 'example2', 'example3']);
    getPackageMock.mock.mockImplementationOnce(() => ({ ...pkg, modules }));
    const areModuleImported = [false, true, false, false, true, false];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isModuleImportedMock.mock.mockImplementation(() => areModuleImported.shift()!);

    const usage = packageUsage('example');

    assert.partialDeepStrictEqual(usage, {
      modulesImported: ['example2'],
      modulesNotImported: ['example1', 'example3'],
    });
  });

  it('tracks its dependencies and dependents', () => {
    const dependents = new Set([{ ...pkg, name: 'example1' }]);
    const dependencies = new Set([{ ...pkg, name: 'example2' }]);
    getPackageMock.mock.mockImplementationOnce(() => ({ ...pkg, dependencies, dependents }));

    const usage = packageUsage('example');

    assert.partialDeepStrictEqual(usage, {
      dependencies: [{ isImported: false, isUsed: false, name: 'example2' }],
      dependents: [{ isImported: false, isUsed: false, name: 'example1' }],
    });
  });
});
