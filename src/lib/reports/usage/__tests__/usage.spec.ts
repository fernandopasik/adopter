import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getPackageNames } from '../../../packages/index.js';
import packageUsage from '../package-usage.js';
import summary from '../summary.js';
import usage from '../usage.js';

jest.mock('../summary');
jest.mock('../../../packages/index.js', () => ({
  getPackageNames: jest.fn(() => []),
}));
jest.mock('../package-usage.js');
jest.mock('../../../packages/resolve-package.js', () =>
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
      packagesUsed: 2,
      packagesUsage: 0.4,
    };

    summaryMock.mockReturnValueOnce(sum);

    expect(usage()).toStrictEqual(expect.objectContaining({ summary: sum }));
    expect(summary).toHaveBeenCalledTimes(1);
  });

  it('has packages', () => {
    const pkgUsage = {
      name: 'example',
      isImported: false,
      isUsed: false,
      dependents: [],
      dependencies: [],
      modulesImported: [],
      modulesNotImported: [],
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
