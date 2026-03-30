import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('get package modules', () => {
  const warnMock = mock.fn((txt?: string) => txt);
  const resolvePackageMock = mock.fn(async (specifier: string) => Promise.resolve(specifier));

  const chalkModule = mock.module('chalk', {
    defaultExport: { yellow: mock.fn((txt: string) => txt) },
  });
  const loglevelModule = mock.module('loglevel', { namedExports: { warn: warnMock } });
  const resolvePackageModule = mock.module('./resolve-package.ts', {
    defaultExport: resolvePackageMock,
  });

  beforeEach(() => {
    resolvePackageMock.mock.resetCalls();
    warnMock.mock.resetCalls();
  });

  after(() => {
    chalkModule.restore();
    loglevelModule.restore();
    resolvePackageModule.restore();
  });

  it('with an empty module', async () => {
    const moduleMock = mock.module('eslint-plugin-prettier', {});
    const getPackageModules = (await import('./get-package-mods.ts')).default;

    const exports = await getPackageModules('eslint-plugin-prettier');

    assert.deepStrictEqual(exports, ['default', 'module.exports']);

    moduleMock.restore();
  });

  it('with a non installed module', async () => {
    const getPackageModules = (await import('./get-package-mods.ts')).default;

    const packageName = 'typescriptzzz';

    const exports = await getPackageModules(packageName);

    assert.strictEqual(warnMock.mock.calls.length, 1);
    assert.match(
      warnMock.mock.calls.at(0)?.arguments.at(0) ?? '',
      new RegExp(`Cannot find package '${packageName}' imported from`, 'u'),
    );

    assert.strictEqual(exports, null);
  });

  it('with a default export', async () => {
    const moduleMock = mock.module('eslint-plugin-security', {
      defaultExport: (): null => null,
    });
    const getPackageModules = (await import('./get-package-mods.ts')).default;

    const exports = await getPackageModules('eslint-plugin-security');

    assert.deepStrictEqual(exports, ['default', 'module.exports']);

    moduleMock.restore();
  });

  it('with a default and named exports', async () => {
    const moduleMock = mock.module('eslint-plugin-yml', {
      defaultExport: (): null => null,
      namedExports: {
        example1: (): null => null,
        example2: (): null => null,
      },
    });
    const getPackageModules = (await import('./get-package-mods.ts')).default;

    const exports = await getPackageModules('eslint-plugin-yml');

    assert.deepStrictEqual(exports, ['default', 'example1', 'example2']);

    moduleMock.restore();
  });

  it('with named exports', async () => {
    const moduleMock = mock.module('eslint-config-prettier', {
      namedExports: {
        example1: 'constant',
        example2: (): null => null,
        example3: {},
      },
    });
    const getPackageModules = (await import('./get-package-mods.ts')).default;

    const exports = await getPackageModules('eslint-config-prettier');

    assert.deepStrictEqual(exports, [
      'default',
      'example1',
      'example2',
      'example3',
      'module.exports',
    ]);

    moduleMock.restore();
  });
});
