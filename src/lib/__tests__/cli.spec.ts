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
    const args = ['--rootDir', 'src', 'dep1', 'dep2'];

    await cli(args);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({ packages: ['dep1', 'dep2'], rootDir: 'src' });
  });
});
