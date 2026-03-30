import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { PackageJson } from 'type-fest';
import type { Import } from '../imports/index.ts';
import type { Dependency } from './filter-tracked-dependencies.ts';
import type { Package } from './packages.ts';

describe('set package dependencies', async () => {
  const filterTrackedDependenciesMock = mock.fn<() => Dependency[]>(() => []);
  const getPackageJsonMock = mock.fn<() => Promise<PackageJson | null>>();
  const getPackageMock = mock.fn<() => Package | undefined>();
  const getPackageNamesMock = mock.fn<() => string[]>(() => []);

  const filterTrackedDependenciesModule = mock.module('./filter-tracked-dependencies.ts', {
    defaultExport: filterTrackedDependenciesMock,
  });
  const packagesModule = mock.module('./packages.ts', {
    namedExports: { getPackage: getPackageMock, getPackageNames: getPackageNamesMock },
  });
  const getPackageJsonModule = mock.module('./get-package-json.ts', {
    defaultExport: getPackageJsonMock,
  });

  const setPackageDependencies = (await import('./set-package-dependencies.ts')).default;

  beforeEach(() => {
    filterTrackedDependenciesMock.mock.resetCalls();
    getPackageMock.mock.resetCalls();
    getPackageNamesMock.mock.resetCalls();
    getPackageJsonMock.mock.resetCalls();
  });

  after(() => {
    filterTrackedDependenciesModule.restore();
    packagesModule.restore();
    getPackageJsonModule.restore();
  });

  it('with none', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.dependencies.size, 0);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.dependencies.size, 0);
  });

  it('with multiple', async () => {
    const pkg = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example',
    };

    const dep1 = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example1',
    };

    const dep2 = {
      dependencies: new Set<Package>(),
      dependents: new Set<Package>(),
      imports: new Set<Import>(),
      isInstalled: false,
      modules: new Set<string>(),
      name: 'example1',
    };

    const depsMock = [pkg, dep1, dep2];

    getPackageMock.mock.mockImplementation(() => depsMock.shift());
    filterTrackedDependenciesMock.mock.mockImplementationOnce(() => [
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
    ]);

    assert.strictEqual(pkg.dependencies.size, 0);
    assert.strictEqual(pkg.dependencies.has(dep1), false);
    assert.strictEqual(pkg.dependencies.has(dep2), false);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.dependencies.size, 2);
    assert.strictEqual(pkg.dependencies.has(dep1), true);
    assert.strictEqual(pkg.dependencies.has(dep2), true);
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

    await setPackageDependencies('example');

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

    getPackageJsonMock.mock.mockImplementationOnce(async () => Promise.resolve(null));
    getPackageMock.mock.mockImplementationOnce(() => pkg);

    assert.strictEqual(pkg.isInstalled, false);

    await setPackageDependencies('example');

    assert.strictEqual(pkg.isInstalled, false);
  });

  it('with non existent package', async () => {
    getPackageMock.mock.mockImplementationOnce(() => undefined);

    await setPackageDependencies('nonexistent');

    assert.strictEqual(getPackageJsonMock.mock.calls.length, 0);
  });
});
