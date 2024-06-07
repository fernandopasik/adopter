import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import log from 'loglevel';
import ProgressBar from 'progress';
import { listFiles, processFiles } from '../files/index.js';
import { analyzePackages } from '../packages/index.js';
import * as reports from '../reports/index.js';
import run from '../run.js';

jest.mock('../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

jest.mock('loglevel');
jest.mock('progress');

jest.mock('../files/index.js', () => ({
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
jest.mock('../packages/index.js', () => ({
  analyzePackages: jest.fn(),
  getPackageNames: jest.fn(() => []),
}));
jest.mock('../reports/index.js', () => ({
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

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('ERROR');

    spy.mockRestore();
  });

  it('can set debug loglevel', async () => {
    const spy = jest.spyOn(log, 'setDefaultLevel');
    const packages = ['dep1', 'dep2'];

    await run({ debug: true, packages });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('DEBUG');

    spy.mockRestore();
  });

  it('analyze packages', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    expect(analyzePackages).toHaveBeenCalledTimes(1);
    expect(analyzePackages).toHaveBeenCalledWith(packages);
  });

  it('creates a progress bar', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    expect(ProgressBar).toHaveBeenCalledTimes(1);
  });

  it('updates progress bar after processing each file', async () => {
    const spy1 = jest.spyOn(ProgressBar.prototype, 'tick');
    const spy2 = jest.spyOn(log, 'getLevel').mockReturnValue(4);
    const packages = ['dep1', 'dep2'];
    const files = ['example1.js', 'example2.js'];

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ packages });

    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy1).toHaveBeenCalledWith(1);

    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('lists all files from source match expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*', '*.js'];

    await run({ packages, srcMatch });

    expect(listFiles).toHaveBeenCalledTimes(1);
    expect(listFiles).toHaveBeenCalledWith(srcMatch);
  });

  it('can set a root directory', async () => {
    const packages = ['dep1', 'dep2'];
    const rootDir = 'src';
    const srcMatch = ['*', '*.js'];

    await run({ packages, rootDir, srcMatch });

    expect(listFiles).toHaveBeenCalledTimes(1);
    expect(listFiles).toHaveBeenCalledWith(['src/*', 'src/*.js']);
  });

  it('ignores files from expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*'];
    const ignore = '*.js';

    await run({ packages, srcIgnoreMatch: [ignore], srcMatch });

    expect(listFiles).toHaveBeenCalledTimes(1);
    expect(listFiles).toHaveBeenCalledWith([...srcMatch, `!${ignore}`]);
  });

  it('processes all files', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['*'];

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ packages });

    expect(processFiles).toHaveBeenCalledTimes(1);
    expect(processFiles).toHaveBeenCalledWith(files, expect.any(Function));
  });

  it('runs on file callback in options', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['example1.js', 'example2.js'];
    const onFile = jest.fn();

    jest.mocked(listFiles).mockReturnValueOnce(files);

    await run({ onFile, packages });

    expect(onFile).toHaveBeenCalledTimes(2);
    expect(onFile).toHaveBeenCalledWith(files[0], files[0], '', undefined, []);
    expect(onFile).toHaveBeenCalledWith(files[1], files[1], '', undefined, []);
  });

  it('prints report', async () => {
    const spy = jest.spyOn(reports, 'print');
    await run({ packages: [] });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('prints usage report', async () => {
    const spy = jest.spyOn(reports.usage, 'text');
    await run({ packages: [] });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('can print coverage report', async () => {
    const spy = jest.spyOn(reports.coverage, 'text');
    await run({ coverage: true, packages: [] });

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});
