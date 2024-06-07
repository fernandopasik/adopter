import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import cli from '../cli.js';
import run from '../run.js';

jest.mock('../run.js', () => jest.fn());

describe('adopter cli', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs with arguments as list of packages', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ packages: args }));
  });

  it('runs with default root directory', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ rootDir: '.' }));
  });

  it('can set root directory', async () => {
    const rootDir = 'src';
    const args = ['--rootDir', rootDir, 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ rootDir }));
  });

  it('by default tracks all js and ts files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ srcMatch: ['**/*.[jt]s?(x)'] }));
  });

  it('can track other files', async () => {
    const track = '**/*.css';
    const args = ['--srcMatch', track, 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ srcMatch: [track] }));
  });

  it('by default does not ignore any files', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ srcIgnoreMatch: [] }));
  });

  it('can ignore files to track', async () => {
    const ignores = '**/*.(spec).js';
    const args = ['--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ srcIgnoreMatch: [ignores] }));
  });

  it('can track and ignore files', async () => {
    const track = '**/*.css';
    const ignores = '**/*.(spec).js';
    const args = ['--srcMatch', track, '--srcIgnoreMatch', ignores, 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(
      expect.objectContaining({ srcIgnoreMatch: [ignores], srcMatch: [track] }),
    );
  });

  it('by default hides coverage', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ coverage: false }));
  });

  it('can display coverage', async () => {
    const args = ['--coverage', 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ coverage: true }));
  });

  it('by default hides debug information', async () => {
    const args = ['dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ debug: false }));
  });

  it('can display debug information', async () => {
    const args = ['--debug', 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ debug: true }));
  });
});
