import { listFiles, processFiles } from '../files/index.js';
import { getPackageExports } from '../packages/index.js';
import { Coverage, Usage } from '../reports/index.js';
import run from '../run.js';

jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

jest.mock('../files/index.js');
jest.mock('../packages/index.js');
jest.mock('../reports/index.js');

describe('run', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('gets packages exports', async () => {
    const packages = ['dep1', 'dep2'];

    await run({ packages });

    expect(getPackageExports).toHaveBeenCalledTimes(1);
    expect(getPackageExports).toHaveBeenCalledWith(packages);
  });

  it('initializes usage with package exports', async () => {
    const packages = ['dep1', 'dep2'];
    const packageExports = new Map();

    (getPackageExports as jest.MockedFunction<typeof getPackageExports>).mockResolvedValueOnce(
      packageExports,
    );

    await run({ packages });

    expect(Usage).toHaveBeenCalledTimes(1);
    expect(Usage).toHaveBeenCalledWith(packageExports);
  });

  it('lists all files from source match expression', async () => {
    const packages = ['dep1', 'dep2'];
    const srcMatch = ['*'];

    await run({ packages, srcMatch });

    expect(listFiles).toHaveBeenCalledTimes(1);
    expect(listFiles).toHaveBeenCalledWith(srcMatch);
  });

  it('processes all files', async () => {
    const packages = ['dep1', 'dep2'];
    const files = ['*'];

    (listFiles as jest.MockedFunction<typeof listFiles>).mockReturnValueOnce(files);

    await run({ packages });

    expect(processFiles).toHaveBeenCalledTimes(1);
    expect(processFiles).toHaveBeenCalledWith(files, expect.any(Function));
  });

  it('prints usage', async () => {
    const packages = ['dep1', 'dep2'];
    const spy = jest.spyOn(Usage.prototype, 'print');

    await run({ packages });

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });

  it('prints coverage', async () => {
    const packages = ['dep1', 'dep2'];
    const spy = jest.spyOn(Coverage.prototype, 'print');

    await run({ packages });

    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore();
  });
});
