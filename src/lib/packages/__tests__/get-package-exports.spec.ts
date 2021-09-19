import findMissingPackages from '../find-missing-packages.js';
import getPackageExports from '../get-package-exports.js';
import listPackageExports from '../list-package-exports.js';

jest.mock('../find-missing-packages.js', () => jest.fn(() => []));
jest.mock('../list-package-exports.js');

describe('get package exports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('finds missing packages', async () => {
    const packageNames = ['dep1', 'dep2'];

    await getPackageExports(packageNames);

    expect(findMissingPackages).toHaveBeenCalledTimes(1);
    expect(findMissingPackages).toHaveBeenCalledWith(packageNames);
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('if there are missing packages, installs them', async () => {
    const packages = ['dep1', 'dep2'];
    (findMissingPackages as jest.MockedFunction<typeof findMissingPackages>).mockResolvedValueOnce([
      'dep1',
    ]);

    await getPackageExports(packages);

    expect(findMissingPackages).toHaveBeenCalledTimes(1);
  });

  it('lists exports from each package', async () => {
    const packages = ['dep1', 'dep2', 'dep3'];

    await getPackageExports(packages);

    expect(listPackageExports).toHaveBeenCalledTimes(3);
  });

  it('returns a list of package exports', async () => {
    const packages = ['dep1', 'dep2', 'dep3'];
    const dep1 = [
      { name: 'default', type: 'function' },
      { name: 'moduleA', type: 'function' },
    ];
    const dep2 = [{ name: 'moduleA', type: 'string' }];
    const dep3 = [
      { name: 'default', type: 'function' },
      { name: 'moduleB', type: 'object' },
    ];

    (listPackageExports as jest.MockedFunction<typeof listPackageExports>)
      .mockResolvedValueOnce(dep1)
      .mockResolvedValueOnce(dep2)
      .mockResolvedValueOnce(dep3);

    const packageExports = await getPackageExports(packages);

    expect(Array.from(packageExports.keys())).toStrictEqual(packages);
    expect(Array.from(packageExports.values())).toStrictEqual([dep1, dep2, dep3]);
  });

  it('with non installed or non existent packages', async () => {
    const packages = ['dep1', 'dep2', 'dep3'];
    const dep1 = [
      { name: 'default', type: 'function' },
      { name: 'moduleA', type: 'function' },
    ];
    const dep2 = [{ name: 'moduleA', type: 'string' }];
    const dep3 = null;

    (listPackageExports as jest.MockedFunction<typeof listPackageExports>)
      .mockResolvedValueOnce(dep1)
      .mockResolvedValueOnce(dep2)
      .mockResolvedValueOnce(dep3);

    const packageExports = await getPackageExports(packages);

    expect(Array.from(packageExports.keys())).toStrictEqual(packages);
    expect(Array.from(packageExports.values())).toStrictEqual([dep1, dep2, dep3]);
  });
});
