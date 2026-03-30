import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('usage summary', async () => {
  const getPackageNamesMock = mock.fn<() => string[]>(() => []);
  const isPackageUsedMock = mock.fn<() => boolean>();

  const isPackageUsedModule = mock.module('./is-package-used.ts', {
    defaultExport: isPackageUsedMock,
  });
  const packagesModule = mock.module('../../packages/index.ts', {
    namedExports: { getPackageNames: getPackageNamesMock },
  });

  const summary = (await import('./summary.ts')).default;

  beforeEach(() => {
    isPackageUsedMock.mock.resetCalls();
  });

  after(() => {
    isPackageUsedModule.restore();
    packagesModule.restore();
  });

  it('empty', () => {
    assert.deepStrictEqual(summary(), {
      packagesTracked: 0,
      packagesUsage: 0,
      packagesUsed: 0,
    });
  });

  it('has number of packages tracked', () => {
    getPackageNamesMock.mock.mockImplementationOnce(() => ['example1', 'example2', 'example3']);

    assert.partialDeepStrictEqual(summary(), { packagesTracked: 3 });
  });

  it('has number of packages used', () => {
    getPackageNamesMock.mock.mockImplementationOnce(() => ['example1', 'example2', 'example3']);
    const packageUsageMock = [false, true, true];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isPackageUsedMock.mock.mockImplementation(() => packageUsageMock.shift()!);

    assert.partialDeepStrictEqual(summary(), { packagesUsed: 2 });
  });

  it('has percentage of packages used', () => {
    getPackageNamesMock.mock.mockImplementationOnce(() => [
      'example1',
      'example2',
      'example3',
      'example4',
    ]);
    const packageUsageMock = [false, true, true, true];
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    isPackageUsedMock.mock.mockImplementation(() => packageUsageMock.shift()!);

    assert.partialDeepStrictEqual(summary(), { packagesUsage: 0.75 });
  });
});
