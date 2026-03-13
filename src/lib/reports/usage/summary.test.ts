import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { getPackageNames } from '../../packages/index.ts';
import isPackageUsed from './is-package-used.ts';
import summary from './summary.ts';

jest.mock('../../packages/index.ts', () => ({
  getPackageNames: jest.fn(() => []),
}));
jest.mock('./is-package-used.ts');

const getPackageNamesMock = jest.mocked(getPackageNames);
const isPackageUsedMock = jest.mocked(isPackageUsed);

describe('usage summary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('empty', () => {
    assert.deepStrictEqual(summary(), {
      packagesTracked: 0,
      packagesUsage: 0,
      packagesUsed: 0,
    });
  });

  it('has number of packages tracked', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3']);

    assert.partialDeepStrictEqual(summary(), { packagesTracked: 3 });
  });

  it('has number of packages used', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3']);
    isPackageUsedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    assert.partialDeepStrictEqual(summary(), { packagesUsed: 2 });
  });

  it('has percentage of packages used', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3', 'example4']);
    isPackageUsedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    assert.partialDeepStrictEqual(summary(), { packagesUsage: 0.75 });
  });
});
