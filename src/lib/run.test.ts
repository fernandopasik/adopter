import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { OnFile } from './run.ts';

describe('run', async () => {
  const analyzePackagesMock = mock.fn();
  const coverageTextMock = mock.fn();
  const debugMock = mock.fn();
  const getLevelMock = mock.fn<() => number>();
  const listFilesMock = mock.fn<() => string[]>(() => []);
  const printMock = mock.fn();
  const processFilesMock = mock.fn(
    (
      files: string[] = [],
      callback?: (filePath: string, filename: string, content: string) => void,
    ) => {
      files.forEach((file) => {
        if (typeof callback === 'function') {
          callback(file, file, '');
        }
      });
    },
  );
  const progressBarMock = mock.fn();
  const progressBarTickMock = mock.fn();
  const setDefaultLevelMock = mock.fn();
  const usageTextMock = mock.fn();

  const filesModule = mock.module('./files/index.ts', {
    namedExports: {
      listFiles: listFilesMock,
      processFiles: processFilesMock,
    },
  });
  const loglevelModule = mock.module('loglevel', {
    namedExports: {
      debug: debugMock,
      getLevel: getLevelMock,
      setDefaultLevel: setDefaultLevelMock,
    },
  });
  const packagesModule = mock.module('./packages/index.ts', {
    namedExports: {
      analyzePackages: analyzePackagesMock,
    },
  });
  const progressModule = mock.module('progress', {
    defaultExport: class {
      public constructor(...args: unknown[]) {
        progressBarMock(...args);
      }

      // eslint-disable-next-line @typescript-eslint/class-methods-use-this
      public tick(...args: unknown[]): void {
        progressBarTickMock(...args);
      }
    },
  });
  const reportsModule = mock.module('./reports/index.ts', {
    namedExports: {
      coverage: {
        text: coverageTextMock,
      },
      print: printMock,
      usage: {
        text: usageTextMock,
      },
    },
  });

  const run = (await import('./run.ts')).default;

  beforeEach(() => {
    analyzePackagesMock.mock.resetCalls();
    coverageTextMock.mock.resetCalls();
    debugMock.mock.resetCalls();
    getLevelMock.mock.resetCalls();
    listFilesMock.mock.resetCalls();
    printMock.mock.resetCalls();
    processFilesMock.mock.resetCalls();
    progressBarMock.mock.resetCalls();
    progressBarTickMock.mock.resetCalls();
    setDefaultLevelMock.mock.resetCalls();
    usageTextMock.mock.resetCalls();
  });

  after(() => {
    filesModule.restore();
    loglevelModule.restore();
    packagesModule.restore();
    progressModule.restore();
    reportsModule.restore();
  });

  it('sets default loglevel', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(setDefaultLevelMock.mock.calls.length, 1);
    assert.deepStrictEqual(setDefaultLevelMock.mock.calls.at(0)?.arguments, ['ERROR']);
  });

  it('can set debug loglevel', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ debug: true, packages });

    assert.strictEqual(setDefaultLevelMock.mock.calls.length, 1);
    assert.deepStrictEqual(setDefaultLevelMock.mock.calls.at(0)?.arguments, ['DEBUG']);
  });

  it('analyze packages', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(analyzePackagesMock.mock.calls.length, 1);
    assert.deepStrictEqual(analyzePackagesMock.mock.calls.at(0)?.arguments, [packages]);
  });

  it('creates a progress bar', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(progressBarMock.mock.calls.length, 1);
  });

  it('updates progress bar after processing each file', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['example1.js', 'example2.js'];

    getLevelMock.mock.mockImplementation(() => 4);
    listFilesMock.mock.mockImplementationOnce(() => files);

    await run({ packages });

    assert.strictEqual(progressBarTickMock.mock.calls.length, 2);
    assert.deepStrictEqual(progressBarTickMock.mock.calls.at(0)?.arguments, [1]);
  });

  it('lists all files from source match expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*', '*.js'];

    await run({ packages, srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.deepStrictEqual(listFilesMock.mock.calls.at(0)?.arguments, [srcMatch]);
  });

  it('can set a root directory', async () => {
    const packages = ['dep1', 'dep2'];
    const rootDir = 'src';
    const srcMatch = ['*', '*.js'];

    await run({ packages, rootDir, srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.deepStrictEqual(listFilesMock.mock.calls.at(0)?.arguments, [['src/*', 'src/*.js']]);
  });

  it('ignores files from expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*'];
    const ignore = '*.js';

    await run({ packages, srcIgnoreMatch: [ignore], srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.deepStrictEqual(listFilesMock.mock.calls.at(0)?.arguments, [
      [...srcMatch, `!${ignore}`],
    ]);
  });

  it('processes all files', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['*'];

    listFilesMock.mock.mockImplementationOnce(() => files);

    await run({ packages });

    assert.strictEqual(processFilesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(processFilesMock.mock.calls.at(0)?.arguments, [files]);
  });

  it('runs on file callback in options', async () => {
    const packages: [string, string] = ['dep1', 'dep2'];
    const files: [string, string] = ['example1.js', 'example2.js'];
    const onFile = mock.fn<OnFile>();

    listFilesMock.mock.mockImplementationOnce(() => files);

    await run({ onFile, packages });

    assert.strictEqual(onFile.mock.calls.length, 2);
    assert.deepStrictEqual(onFile.mock.calls.at(0)?.arguments, [
      files[0],
      files[0],
      '',
      undefined,
      [],
    ]);
    assert.deepStrictEqual(onFile.mock.calls.at(1)?.arguments, [
      files[1],
      files[1],
      '',
      undefined,
      [],
    ]);
  });

  it('prints report', async () => {
    await run({ packages: [] });

    assert.strictEqual(printMock.mock.calls.length, 1);
  });

  it('prints usage report', async () => {
    await run({ packages: [] });

    assert.strictEqual(usageTextMock.mock.calls.length, 1);
  });

  it('can print coverage report', async () => {
    await run({ coverage: true, packages: [] });

    assert.strictEqual(coverageTextMock.mock.calls.length, 1);
  });
});
