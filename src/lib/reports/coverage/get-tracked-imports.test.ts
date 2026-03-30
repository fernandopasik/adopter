import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('get tracked imports', async () => {
  const isPackageImportedMock = mock.fn<() => boolean>();
  const isModuleImportedMock = mock.fn<() => boolean>();

  const filesModule = mock.module('../../packages/index.ts', {
    namedExports: {
      isModuleImported: isModuleImportedMock,
      isPackageImported: isPackageImportedMock,
    },
  });

  const getTrackedImports = (await import('./get-tracked-imports.ts')).default;

  beforeEach(() => {
    isPackageImportedMock.mock.resetCalls();
    isModuleImportedMock.mock.resetCalls();
  });

  after(() => {
    filesModule.restore();
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
    assert.deepStrictEqual(getTrackedImports(), []);
  });

  it('with non tracked packages', () => {
    assert.deepStrictEqual(getTrackedImports(imports), []);
  });

  it('with all tracked packages', () => {
    isPackageImportedMock.mock.mockImplementation(() => true);

    const trackedImports = getTrackedImports(imports);

    assert.partialDeepStrictEqual(trackedImports[0], { packageName: 'dep1' });
    assert.partialDeepStrictEqual(trackedImports[1], { packageName: 'dep2' });
    assert.partialDeepStrictEqual(trackedImports[2], { packageName: 'dep3' });
  });

  it('with some tracked packages', () => {
    const arePackagesImported = [true, false, true];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isPackageImportedMock.mock.mockImplementation(() => arePackagesImported.shift()!);

    const trackedImports = getTrackedImports(imports);

    assert.partialDeepStrictEqual(trackedImports[0], { packageName: 'dep1' });
    assert.partialDeepStrictEqual(trackedImports[1], { packageName: 'dep3' });
  });

  it('with no tracked modules', () => {
    isPackageImportedMock.mock.mockImplementation(() => true);

    const trackedImports = getTrackedImports(imports);

    assert.deepStrictEqual(trackedImports, [
      { moduleNames: [], packageName: 'dep1' },
      { moduleNames: [], packageName: 'dep2' },
      { moduleNames: [], packageName: 'dep3' },
    ]);
  });

  it('with all tracked modules', () => {
    isModuleImportedMock.mock.mockImplementation(() => true);
    isPackageImportedMock.mock.mockImplementation(() => true);

    const trackedImports = getTrackedImports(imports);

    assert.deepStrictEqual(trackedImports, [
      { moduleNames: ['default'], packageName: 'dep1' },
      { moduleNames: ['methodA', 'methodB'], packageName: 'dep2' },
      { moduleNames: ['default', 'methodA'], packageName: 'dep3' },
    ]);
  });

  it('with some tracked modules', () => {
    const areModulesImported = [true, false, true, false, true];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isModuleImportedMock.mock.mockImplementation(() => areModulesImported.shift()!);
    isPackageImportedMock.mock.mockImplementation(() => true);

    const trackedImports = getTrackedImports(imports);

    assert.deepStrictEqual(trackedImports, [
      { moduleNames: ['default'], packageName: 'dep1' },
      { moduleNames: ['methodB'], packageName: 'dep2' },
      { moduleNames: ['methodA'], packageName: 'dep3' },
    ]);
  });
});
