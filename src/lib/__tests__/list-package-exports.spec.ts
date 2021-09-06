import listPackageExports from '../list-package-exports.js';

describe('list package exports', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
  });

  it('with an empty module', async () => {
    jest.doMock('typescript', () => undefined);

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual({ default: 'undefined' });
  });

  it('with a default export', async () => {
    jest.doMock('typescript', () => (): null => null);

    const exports = await listPackageExports('typescript');

    expect(exports).toStrictEqual({ default: 'function' });
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

    expect(exports).toStrictEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: 'boolean',
      default: 'function',
      example1: 'function',
      example2: 'function',
    });
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

    expect(exports).toStrictEqual({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: 'boolean',
      example1: 'string',
      example2: 'function',
      example3: 'object',
    });
  });
});
