import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import type { Import } from '../../imports/index.ts';
import { getPackage, isPackageImported, type Package } from '../../packages/index.ts';
import isPackageUsed from './is-package-used.ts';

jest.mock('../../packages/index.ts', () => ({
  getPackage: jest.fn(),
  isPackageImported: jest.fn(() => false),
}));

describe('is package used', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const getPackageMock = jest.mocked(getPackage).mockReturnValueOnce(pkg);
    const isPackageImportedMock = jest.mocked(isPackageImported);
    isPackageImportedMock.mockReturnValueOnce(false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 1);
    assert.strictEqual(getPackageMock.mock.calls.length, 1);
  });

  it('with an imported package', () => {
    const getPackageMock = jest.mocked(getPackage);
    const isPackageImportedMock = jest.mocked(isPackageImported);
    isPackageImportedMock.mockReturnValueOnce(true);

    assert.strictEqual(isPackageUsed('example'), true);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 1);
    assert.strictEqual(getPackageMock.mock.calls.length, 0);
  });

  it('with an imported dependent package', () => {
    jest.mocked(getPackage).mockReturnValueOnce({
      ...pkg,
      dependents: new Set([pkg2]),
    });
    const isPackageImportedMock = jest.mocked(isPackageImported);
    isPackageImportedMock.mockReturnValueOnce(false);
    isPackageImportedMock.mockReturnValueOnce(true);

    assert.strictEqual(isPackageUsed('example'), true);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
  });

  it('with not imported dependent packages', () => {
    const getPackageMock = jest.mocked(getPackage);
    getPackageMock.mockReturnValueOnce({ ...pkg, dependents: new Set([pkg2]) });
    getPackageMock.mockReturnValueOnce(pkg2);

    const isPackageImportedMock = jest.mocked(isPackageImported);
    isPackageImportedMock.mockReturnValueOnce(false);
    isPackageImportedMock.mockReturnValueOnce(false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
    assert.strictEqual(getPackageMock.mock.calls.length, 2);
  });

  it('with a non tracked dependent packages', () => {
    const getPackageMock = jest.mocked(getPackage);
    getPackageMock.mockReturnValueOnce({ ...pkg, dependents: new Set([pkg2]) });
    getPackageMock.mockReturnValueOnce(undefined);

    const isPackageImportedMock = jest.mocked(isPackageImported);
    isPackageImportedMock.mockReturnValueOnce(false);
    isPackageImportedMock.mockReturnValueOnce(false);

    assert.strictEqual(isPackageUsed('example'), false);
    assert.strictEqual(isPackageImportedMock.mock.calls.length, 2);
    assert.strictEqual(getPackageMock.mock.calls.length, 2);
  });
});
