import execa from 'execa';
import installPackages from '../install-packages.js';

jest.mock('execa', () => jest.fn());

describe('install packages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('executes npm', async () => {
    const packages = ['dep1', 'dep2'];
    await installPackages(packages);

    expect(execa).toHaveBeenCalledTimes(1);
    expect(execa).toHaveBeenCalledWith('npm', expect.arrayContaining(['install', ...packages]), {
      shell: true,
    });
  });

  it('does not execute npm with empty list', async () => {
    await installPackages();

    expect(execa).toHaveBeenCalledTimes(0);
  });
});
