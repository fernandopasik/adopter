import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { Import } from '../imports/index.ts';
import type { Package } from './packages.ts';

describe('set package modules', async () => {
  const getPackageModulesMock = mock.fn<() => Promise<string[] | null>>(async () =>
    Promise.resolve([]),
  );
  const getPackageMock = mock.fn<() => Package | undefined>();

  const packagesModule = mock.module('./packages.ts', {
    namedExports: { getPackage: getPackageMock },
  });
  const getPackageModsModule = mock.module('./get-package-mods.ts', {
    defaultExport: getPackageModulesMock,
  });

  const setPackageMods = (await import('./set-package-mods.ts')).default;

  beforeEach(() => {
    getPackageMock.mock.resetCalls();
    getPackageModulesMock.mock.resetCalls();
  });

  after(() => {
    packagesModule.restore();
    getPackageModsModule.restore();
  });

  it('with no modules', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.modules.size, 0);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 0);
  });

  it('with a default module', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageModulesMock.mock.mockImplementationOnce(async () => Promise.resolve(['default']));
    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.modules.size, 0);
    assert.strictEqual(pkg.modules.has('default'), false);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 1);
    assert.strictEqual(pkg.modules.has('default'), true);
  });

  it('with a multiple modules', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageModulesMock.mock.mockImplementationOnce(async () =>
      Promise.resolve(['default', 'moduleA', 'moduleB']),
    );
    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.modules.size, 0);

    await setPackageMods('example');

    assert.strictEqual(pkg.modules.size, 3);
  });

  it('sets installed true', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageMods('example');

    assert.strictEqual(pkg.isInstalled, true);
  });

  it('handles an uninstalled package', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageMock.mock.mockImplementationOnce(() => pkg);
    getPackageModulesMock.mock.mockImplementationOnce(async () => Promise.resolve(null));

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageMods('example');

    assert.strictEqual(pkg.isInstalled, false);
  });

  it('with non existent package', async () => {
    getPackageMock.mock.mockImplementationOnce(() => undefined);

    await setPackageMods('nonexistent');

    assert.strictEqual(getPackageModulesMock.mock.calls.length, 0);
  });
});
