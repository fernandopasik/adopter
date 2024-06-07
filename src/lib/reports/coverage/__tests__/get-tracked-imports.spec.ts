import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { isModuleImported, isPackageImported } from '../../../packages/index.js';
import getTrackedImports from '../get-tracked-imports.js';

jest.mock('../../../packages/index.js', () => ({
  isModuleImported: jest.fn(() => false),
  isPackageImported: jest.fn(() => false),
}));

const isPackageImportedMock = jest.mocked(isPackageImported);
const isModuleImportedMock = jest.mocked(isModuleImported);

describe('get tracked imports', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const imports = [
    {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    },
    {
      filePath: 'example.js',
      moduleNames: ['methodA', 'methodB'],
      moduleSpecifier: 'dep2',
      packageName: 'dep2',
    },
    {
      filePath: 'example.js',
      moduleNames: ['default', 'methodA'],
      moduleSpecifier: 'dep3',
      packageName: 'dep3',
    },
  ];

  it('with no imports', () => {
    expect(getTrackedImports()).toStrictEqual([]);
  });

  it('with non tracked packages', () => {
    expect(getTrackedImports(imports)).toStrictEqual([]);
  });

  it('with all tracked packages', () => {
    isPackageImportedMock.mockReturnValue(true);

    const trackedImports = getTrackedImports(imports);

    expect(trackedImports[0]).toStrictEqual(expect.objectContaining({ packageName: 'dep1' }));
    expect(trackedImports[1]).toStrictEqual(expect.objectContaining({ packageName: 'dep2' }));
    expect(trackedImports[2]).toStrictEqual(expect.objectContaining({ packageName: 'dep3' }));
  });

  it('with some tracked packages', () => {
    isPackageImportedMock
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);

    const trackedImports = getTrackedImports(imports);

    expect(trackedImports[0]).toStrictEqual(expect.objectContaining({ packageName: 'dep1' }));
    expect(trackedImports[1]).toStrictEqual(expect.objectContaining({ packageName: 'dep3' }));
  });

  it('with no tracked modules', () => {
    isPackageImportedMock.mockReturnValue(true);

    const trackedImports = getTrackedImports(imports);

    expect(trackedImports).toStrictEqual([
      { packageName: 'dep1', moduleNames: [] },
      { packageName: 'dep2', moduleNames: [] },
      { packageName: 'dep3', moduleNames: [] },
    ]);
  });

  it('with all tracked modules', () => {
    isModuleImportedMock.mockReturnValue(true);
    isPackageImportedMock.mockReturnValue(true);

    const trackedImports = getTrackedImports(imports);

    expect(trackedImports).toStrictEqual([
      { packageName: 'dep1', moduleNames: ['default'] },
      { packageName: 'dep2', moduleNames: ['methodA', 'methodB'] },
      { packageName: 'dep3', moduleNames: ['default', 'methodA'] },
    ]);
  });

  it('with some tracked modules', () => {
    isModuleImportedMock
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    isPackageImportedMock.mockReturnValue(true);

    const trackedImports = getTrackedImports(imports);

    expect(trackedImports).toStrictEqual([
      { packageName: 'dep1', moduleNames: ['default'] },
      { packageName: 'dep2', moduleNames: ['methodB'] },
      { packageName: 'dep3', moduleNames: ['methodA'] },
    ]);
  });
});
