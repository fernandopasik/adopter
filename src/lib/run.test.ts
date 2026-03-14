import { beforeEach, describe, it, jest } from '@jest/globals';
import log from 'loglevel';
import assert from 'node:assert/strict';
import ProgressBar from 'progress';
import { listFiles, processFiles } from './files/index.ts';
import { analyzePackages } from './packages/index.ts';
import * as reports from './reports/index.ts';
import run, { type OnFile } from './run.ts';

const analyzePackagesMock = jest.mocked(analyzePackages);
const listFilesMock = jest.mocked(listFiles);
const processFilesMock = jest.mocked(processFiles);
// eslint-disable-next-line @typescript-eslint/naming-convention
const ProgressBarMock = jest.mocked(ProgressBar);

jest.mock('./packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

jest.mock('loglevel');
jest.mock('progress');

jest.mock('./files/index.ts', () => ({
  listFiles: jest.fn(() => []),
  processFiles: jest.fn(
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
  ),
}));
jest.mock('./packages/index.ts', () => ({
  analyzePackages: jest.fn(),
  getPackageNames: jest.fn(() => []),
}));
jest.mock('./reports/index.ts', () => ({
  coverage: { text: jest.fn() },
  print: jest.fn(),
  usage: { text: jest.fn() },
}));

describe('run', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets default loglevel', async () => {
    const spy = jest.spyOn(log, 'setDefaultLevel');
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), ['ERROR']);

    spy.mockRestore();
  });

  it('can set debug loglevel', async () => {
    const spy = jest.spyOn(log, 'setDefaultLevel');
    const packages = ['dep1', 'dep2'];

    await run({ debug: true, packages });

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), ['DEBUG']);

    spy.mockRestore();
  });

  it('analyze packages', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(analyzePackagesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(analyzePackagesMock.mock.calls.at(0), [packages]);
  });

  it('creates a progress bar', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    assert.strictEqual(ProgressBarMock.mock.calls.length, 1);
  });

  it('updates progress bar after processing each file', async () => {
    const spy1 = jest.spyOn(ProgressBar.prototype, 'tick');
    const spy2 = jest.spyOn(log, 'getLevel').mockReturnValue(4);
    const packages = ['dep1', 'dep2'];
    const files = ['example1.js', 'example2.js'];

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ packages });

    assert.strictEqual(spy1.mock.calls.length, 2);
    assert.partialDeepStrictEqual(spy1.mock.calls.at(0), [1]);

    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('lists all files from source match expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*', '*.js'];

    await run({ packages, srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(listFilesMock.mock.calls.at(0), [srcMatch]);
  });

  it('can set a root directory', async () => {
    const packages = ['dep1', 'dep2'];
    const rootDir = 'src';
    const srcMatch = ['*', '*.js'];

    await run({ packages, rootDir, srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(listFilesMock.mock.calls.at(0), [['src/*', 'src/*.js']]);
  });

  it('ignores files from expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*'];
    const ignore = '*.js';

    await run({ packages, srcIgnoreMatch: [ignore], srcMatch });

    assert.strictEqual(listFilesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(listFilesMock.mock.calls.at(0), [[...srcMatch, `!${ignore}`]]);
  });

  it('processes all files', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['*'];

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ packages });

    assert.strictEqual(processFilesMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(processFilesMock.mock.calls.at(0), [files]);
  });

  it('runs on file callback in options', async () => {
    const packages: [string, string] = ['dep1', 'dep2'];
    const files: [string, string] = ['example1.js', 'example2.js'];
    const onFile = jest.fn<OnFile>();

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ onFile, packages });

    assert.strictEqual(onFile.mock.calls.length, 2);
    assert.partialDeepStrictEqual(onFile.mock.calls.at(0), [files[0], files[0], '', undefined, []]);
    assert.partialDeepStrictEqual(onFile.mock.calls.at(1), [files[1], files[1], '', undefined, []]);
  });

  it('prints report', async () => {
    const spy = jest.spyOn(reports, 'print');
    await run({ packages: [] });

    assert.strictEqual(spy.mock.calls.length, 1);
    spy.mockRestore();
  });

  it('prints usage report', async () => {
    const spy = jest.spyOn(reports.usage, 'text');
    await run({ packages: [] });

    assert.strictEqual(spy.mock.calls.length, 1);
    spy.mockRestore();
  });

  it('can print coverage report', async () => {
    const spy = jest.spyOn(reports.coverage, 'text');
    await run({ coverage: true, packages: [] });

    assert.strictEqual(spy.mock.calls.length, 1);
    spy.mockRestore();
  });
});
