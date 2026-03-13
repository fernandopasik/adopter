import { beforeEach, describe, it, jest } from '@jest/globals';
import log from 'loglevel';
import assert from 'node:assert/strict';
import getPackageModules from './get-package-mods.ts';

jest.mock('./resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);
jest.mock('loglevel');

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

    assert.deepStrictEqual(exports, []);
  });

  it('with a non installed module', async () => {
    const spy = jest.spyOn(log, 'warn').mockImplementation(jest.fn<typeof log.warn>());
    const packageName = 'typescriptzzz';

    const exports = await getPackageModules(packageName);

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.match(
      spy.mock.calls.at(0)?.at(0) as string,
      new RegExp(`Cannot find module '${packageName}' from`, 'u'),
    );

    assert.strictEqual(exports, null);

    spy.mockRestore();
  });

  it('with a default export', async () => {
    jest.doMock('typescript', () => (): null => null);

    const exports = await getPackageModules('typescript');

    assert.deepStrictEqual(exports, ['length', 'name', 'default']);
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

    assert.deepStrictEqual(exports, ['default', 'example1', 'example2']);
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

    assert.deepStrictEqual(exports, ['example1', 'example2', 'example3']);
  });
});
