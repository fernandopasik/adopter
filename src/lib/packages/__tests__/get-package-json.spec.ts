import log from 'loglevel';
import getPackageJson from '../get-package-json.js';

jest.mock('../resolve-package.js', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);
jest.mock('loglevel');
jest.mock('nanocolors', () => ({
  yellow: (t: string): string => t,
}));

describe('get package.json', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
  });

  it('with an existing package', async () => {
    jest.doMock('typescript/package.json', () => ({
      name: 'typescript',
    }));

    const packageJson = await getPackageJson('typescript');

    expect(packageJson).toStrictEqual({
      name: 'typescript',
    });
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation();
    const errorMessage = 'Cannot find module';
    jest.doMock('typescript/package.json', () => {
      throw new Error(errorMessage);
    });

    const packageJson = await getPackageJson('typescript');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(errorMessage);
    expect(packageJson).toBeNull();

    spy.mockRestore();
  });
});
