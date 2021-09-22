import getPackageExports from '../get-package-exports.js';
import type { Export } from '../list-package-exports.js';
import listPackageExports from '../list-package-exports.js';

jest.mock('../list-package-exports.js');

describe('get package exports', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('lists exports from each package', async () => {
    const packages = ['dep1', 'dep2', 'dep3'];

    await getPackageExports(packages);

    expect(listPackageExports).toHaveBeenCalledTimes(3);
  });

  it('returns a list of package exports', async () => {
    const packages = ['dep1', 'dep2', 'dep3', 'dep4'];
    const dep1 = [
      { name: 'default', type: 'function' },
      { name: 'moduleA', type: 'function' },
    ];
    const dep2 = [{ name: 'moduleA', type: 'string' }];
    const dep3: Export[] = [];
    const dep4 = [
      { name: 'default', type: 'function' },
      { name: 'moduleB', type: 'object' },
    ];

    (listPackageExports as jest.MockedFunction<typeof listPackageExports>)
      .mockResolvedValueOnce(dep1)
      .mockResolvedValueOnce(dep2)
      .mockResolvedValueOnce(dep3)
      .mockResolvedValueOnce(dep4);

    const packageExports = await getPackageExports(packages);

    expect(Array.from(packageExports.keys())).toStrictEqual(packages);
    expect(Array.from(packageExports.values())).toStrictEqual([dep1, dep2, dep3, dep4]);
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
