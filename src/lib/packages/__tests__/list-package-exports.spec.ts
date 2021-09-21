import listPackageExports from '../list-package-exports.js';

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
    const exports = await listPackageExports('typescriptzzz');

    expect(exports).toBeNull();
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
