import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getPackageNames } from '../../../packages/index.js';
import isPackageUsed from '../is-package-used.js';
import summary from '../summary.js';

jest.mock('../../../packages/index.js', () => ({
  getPackageNames: jest.fn(() => []),
}));
jest.mock('../is-package-used.js');

const getPackageNamesMock = getPackageNames as jest.MockedFunction<typeof getPackageNames>;
const isPackageUsedMock = isPackageUsed as jest.MockedFunction<typeof isPackageUsed>;

describe('usage summary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('empty', () => {
    expect(summary()).toStrictEqual({
      packagesTracked: 0,
      packagesUsed: 0,
      packagesUsage: 0,
    });
  });

  it('has number of packages tracked', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3']);

    expect(summary()).toStrictEqual(expect.objectContaining({ packagesTracked: 3 }));
  });

  it('has number of packages used', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3']);
    isPackageUsedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    expect(summary()).toStrictEqual(expect.objectContaining({ packagesUsed: 2 }));
  });

  it('has percentage of packages used', () => {
    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3', 'example4']);
    isPackageUsedMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    expect(summary()).toStrictEqual(expect.objectContaining({ packagesUsage: 0.75 }));
  });
});
