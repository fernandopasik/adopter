import log from 'loglevel';
import getPackageModules from '../get-package-mods.js';

jest.mock('../resolve-package.js', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);
jest.mock('loglevel');
jest.mock('chalk', () => ({
  yellow: (t: string): string => t,
}));

describe('get package modules', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
  });

  it('with an empty module', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
    }));

    const exports = await getPackageModules('typescript');

    expect(exports).toStrictEqual(['__esModule']);
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation();
    const packageName = 'typescriptzzz';

    const exports = await getPackageModules(packageName);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`Cannot find module '${packageName}' from`),
    );
    expect(exports).toBeNull();

    spy.mockRestore();
  });

  it('with a default export', async () => {
    jest.doMock('typescript', () => (): null => null);

    const exports = await getPackageModules('typescript');

    expect(exports).toStrictEqual(['default']);
  });

  it('with a default and named exports', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
      default: (): null => null,
      example1: (): null => null,
      example2: (): null => null,
    }));

    const exports = await getPackageModules('typescript');

    expect(exports).toStrictEqual(['__esModule', 'default', 'example1', 'example2']);
  });

  it('with named exports', async () => {
    jest.doMock('typescript', () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      __esModule: true,
      example1: 'constant',
      example2: (): null => null,
      example3: {},
    }));

    const exports = await getPackageModules('typescript');

    expect(exports).toStrictEqual(['__esModule', 'example1', 'example2', 'example3']);
  });
});
