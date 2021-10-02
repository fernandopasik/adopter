import cli from '../cli.js';
import run from '../run.js';

jest.mock('../run.js', () => jest.fn());
jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

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
});
