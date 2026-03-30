import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('adopter cli', async () => {
  const runMock = mock.fn();
  const runModule = mock.module('./run.ts', { defaultExport: runMock });

  const cli = (await import('./cli.ts')).default;

  beforeEach(() => {
    runMock.mock.resetCalls();
  });

  after(() => {
    runModule.restore();
  });

  it('runs with arguments as list of packages', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ packages: args }]);
  });

  it('runs with default root directory', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ rootDir: '.' }]);
  });

  it('can set root directory', async () => {
    const rootDir = 'src';
    const args = ['--rootDir', rootDir, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ rootDir }]);
  });

  it('by default tracks all js and ts files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [
      { srcMatch: ['**/*.[jt]s?(x)'] },
    ]);
  });

  it('can track other files', async () => {
    const track = '**/*.css';
    const args = ['--srcMatch', track, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ srcMatch: [track] }]);
  });

  it('by default does not ignore any files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ srcIgnoreMatch: [] }]);
  });

  it('can ignore files to track', async () => {
    const ignores = '**/*.(spec).js';
    const args = ['--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [
      { srcIgnoreMatch: [ignores] },
    ]);
  });

  it('can track and ignore files', async () => {
    const track = '**/*.css';
    const ignores = '**/*.(spec).js';
    const args = ['--srcMatch', track, '--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [
      { srcIgnoreMatch: [ignores], srcMatch: [track] },
    ]);
  });

  it('by default hides coverage', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ coverage: false }]);
  });

  it('can display coverage', async () => {
    const args = ['--coverage', 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ coverage: true }]);
  });

  it('by default hides debug information', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ debug: false }]);
  });

  it('can display debug information', async () => {
    const args = ['--debug', 'dep1', 'dep2'];

    await cli(args);

    assert.strictEqual(runMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(runMock.mock.calls.at(0)?.arguments, [{ debug: true }]);
  });
});
