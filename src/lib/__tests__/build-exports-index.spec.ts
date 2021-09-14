import buildExportsIndex from '../build-exports-index.js';
import { findMissingPackages, installPackages, listPackageExports } from '../packages/index.js';

jest.mock('../packages/index.js', () => ({
  findMissingPackages: jest.fn(() => []),
  installPackages: jest.fn(),
  listPackageExports: jest.fn(() => 'undefined'),
}));

describe('build exports index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with empty list', async () => {
    expect(await buildExportsIndex()).toStrictEqual({});
  });

  it('checks for missing packages', async () => {
    const packages = ['dep1', 'dep2'];

    await buildExportsIndex(packages);

    expect(findMissingPackages).toHaveBeenCalledTimes(1);
    expect(findMissingPackages).toHaveBeenCalledWith(packages);
  });

  it('install packages if some missing', async () => {
    const packages = ['dep1', 'dep2'];

    (findMissingPackages as jest.MockedFunction<typeof findMissingPackages>).mockResolvedValueOnce([
      'dep2',
    ]);

    await buildExportsIndex(packages);

    expect(installPackages).toHaveBeenCalledTimes(1);
    expect(installPackages).toHaveBeenCalledWith(packages);
  });

  it('list exports from each package', async () => {
    const packages = ['dep1', 'dep2'];

    await buildExportsIndex(packages);

    expect(listPackageExports).toHaveBeenCalledTimes(2);
    expect(listPackageExports).toHaveBeenNthCalledWith(1, packages[0]);
    expect(listPackageExports).toHaveBeenNthCalledWith(2, packages[1]);
  });

  it('returns an index with packages and its exports', async () => {
    const packages = ['dep1', 'dep2'];
    const dep1 = [
      { name: 'a', type: 'string' },
      { name: 'b', type: 'function' },
    ];
    const dep2 = [{ name: 'default', type: 'function' }];

    (listPackageExports as jest.MockedFunction<typeof listPackageExports>)
      .mockResolvedValueOnce(dep1)
      .mockResolvedValueOnce(dep2);

    const index = await buildExportsIndex(packages);

    expect(index).toStrictEqual({ dep1, dep2 });
  });
});
