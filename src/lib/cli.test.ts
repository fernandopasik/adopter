import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import cli from './cli.ts';
import run from './run.ts';

jest.mock('./run.ts', () => jest.fn());

const runMock = jest.mocked(run);

describe('adopter cli', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs with arguments as list of packages', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ packages: args }]);
  });

  it('runs with default root directory', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ rootDir: '.' }]);
  });

  it('can set root directory', async () => {
    const rootDir = 'src';
    const args = ['--rootDir', rootDir, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ rootDir }]);
  });

  it('by default tracks all js and ts files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ srcMatch: ['**/*.[jt]s?(x)'] }]);
  });

  it('can track other files', async () => {
    const track = '**/*.css';
    const args = ['--srcMatch', track, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ srcMatch: [track] }]);
  });

  it('by default does not ignore any files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ srcIgnoreMatch: [] }]);
  });

  it('can ignore files to track', async () => {
    const ignores = '**/*.(spec).js';
    const args = ['--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ srcIgnoreMatch: [ignores] }]);
  });

  it('can track and ignore files', async () => {
    const track = '**/*.css';
    const ignores = '**/*.(spec).js';
    const args = ['--srcMatch', track, '--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [
      { srcIgnoreMatch: [ignores], srcMatch: [track] },
    ]);
  });

  it('by default hides coverage', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ coverage: false }]);
  });

  it('can display coverage', async () => {
    const args = ['--coverage', 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ coverage: true }]);
  });

  it('by default hides debug information', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ debug: false }]);
  });

  it('can display debug information', async () => {
    const args = ['--debug', 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0), [{ debug: true }]);
  });
});
