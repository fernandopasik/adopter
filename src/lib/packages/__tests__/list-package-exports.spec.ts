import log from 'loglevel';
import listPackageExports from '../list-package-exports.js';

jest.mock('../resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('list package exports', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
  });

  it('with an empty module', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
    }));

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual([{ name: '__esModule', type: 'boolean' }]);
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation();
    const packageName = 'typescriptzzz';

    const exports = await listPackageExports(packageName);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(`Cannot import package ${packageName}`);
    expect(exports).toBeNull();

    spy.mockRestore();
  });

  it('with a default export', async () => {
    jest.doMock('typescript', () => (): null => null);

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual([{ name: 'default', type: 'function' }]);
  });

  it('with a default and named exports', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
      default: (): null => null,
      example1: (): null => null,
      example2: (): null => null,
    }));

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual([
      { name: '__esModule', type: 'boolean' },
      { name: 'default', type: 'function' },
      { name: 'example1', type: 'function' },
      { name: 'example2', type: 'function' },
    ]);
  });

  it('with named exports', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
      example1: 'constant',
      example2: (): null => null,
      example3: {},
    }));

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual([
      { name: '__esModule', type: 'boolean' },
      { name: 'example1', type: 'string' },
      { name: 'example2', type: 'function' },
      { name: 'example3', type: 'object' },
    ]);
  });
});
