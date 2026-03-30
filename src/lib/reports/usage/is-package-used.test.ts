import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { Import } from '../../imports/index.ts';
import type { Package } from '../../packages/index.ts';

describe('is package used', async () => {
  const getPackageMock = mock.fn<() => Package | undefined>();
  const isPackageImportedMock = mock.fn(() => false);
  const packagesModule = mock.module('../../packages/index.ts', {
    namedExports: {
      getPackage: getPackageMock,
      isPackageImported: isPackageImportedMock,
    },
  });

  const isPackageUsed = (await import('./is-package-used.ts')).default;

  beforeEach(() => {
    getPackageMock.mock.resetCalls();
    isPackageImportedMock.mock.resetCalls();
  });

  after(() => {
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

  const pkg2 = {
    ...pkg,
    name: 'example2',
  };

  it('with a non imported package', () => {
    getPackageMock.mock.mockImplementationOnce(() => pkg);
    isPackageImportedMock.mock.mockImplementationOnce(() => false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 1);
    assert.strictEqual(getPackageMock.mock.calls.length, 1);
  });

  it('with an imported package', () => {
    isPackageImportedMock.mock.mockImplementationOnce(() => true);

    assert.strictEqual(isPackageUsed('example'), true);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 1);
    assert.strictEqual(getPackageMock.mock.calls.length, 0);
  });

  it('with an imported dependent package', () => {
    getPackageMock.mock.mockImplementationOnce(() => ({
      ...pkg,
      dependents: new Set([pkg2]),
    }));

    const isImportedMocks = [false, true];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isPackageImportedMock.mock.mockImplementation(() => isImportedMocks.shift()!);

    assert.strictEqual(isPackageUsed('example'), true);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
  });

  it('with not imported dependent packages', () => {
    const packageMocks = [{ ...pkg, dependents: new Set([pkg2]) }, pkg2];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getPackageMock.mock.mockImplementation(() => packageMocks.shift()!);

    isPackageImportedMock.mock.mockImplementation(() => false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
    assert.strictEqual(getPackageMock.mock.calls.length, 2);
  });

  it('with a non tracked dependent packages', () => {
    getPackageMock.mock.mockImplementationOnce(() => ({ ...pkg, dependents: new Set([pkg2]) }));

    isPackageImportedMock.mock.mockImplementation(() => false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
    assert.strictEqual(getPackageMock.mock.calls.length, 2);
  });
});
