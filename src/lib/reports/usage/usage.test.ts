import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { getPackageNames } from '../../packages/index.ts';
import packageUsage from './package-usage.ts';
import summary from './summary.ts';
import usage from './usage.ts';

jest.mock('./summary');
jest.mock('../../packages/index.ts', () => ({
  getPackageNames: jest.fn(() => []),
}));
jest.mock('./package-usage.ts');
jest.mock('../../packages/resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

const summaryMock = jest.mocked(summary);
const getPackageNamesMock = jest.mocked(getPackageNames);
const packageUsageMock = jest.mocked(packageUsage);

describe('usage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has a summary', () => {
    const sum = {
      packagesTracked: 5,
      packagesUsage: 0.4,
      packagesUsed: 2,
    };

    summaryMock.mockReturnValueOnce(sum);

    assert.partialDeepStrictEqual(usage(), { summary: sum });
    expect(summary).toHaveBeenCalledTimes(1);
  });

  it('has packages', () => {
    const pkgUsage = {
      dependencies: [],
      dependents: [],
      isImported: false,
      isUsed: false,
      modulesImported: [],
      modulesNotImported: [],
      name: 'example',
    };

    getPackageNamesMock.mockReturnValueOnce(['example1', 'example2', 'example3']);
    packageUsageMock
      .mockReturnValueOnce({ ...pkgUsage, name: 'example1' })
      .mockReturnValueOnce({ ...pkgUsage, name: 'example2' })
      .mockReturnValueOnce({ ...pkgUsage, name: 'example3' });

    usage();

    expect(getPackageNames).toHaveBeenCalledTimes(1);
    expect(packageUsage).toHaveBeenCalledTimes(3);
  });
});
