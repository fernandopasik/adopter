import { globbySync } from 'globby';
import listFiles from '../list-files.js';

jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

describe('list files from globs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to js and ts files', () => {
    listFiles();

    expect(globbySync).toHaveBeenCalledTimes(1);
    expect(globbySync).toHaveBeenCalledWith(['**/*.[j|t]s'], expect.anything());
  });

  it('uses project gitignore', () => {
    listFiles();

    expect(globbySync).toHaveBeenCalledTimes(1);
    expect(globbySync).toHaveBeenCalledWith(expect.anything(), { gitignore: true });
  });

  it('can search custom globs', () => {
    const globs = ['src/asdf.txt'];
    listFiles(globs);

    expect(globbySync).toHaveBeenCalledTimes(1);
    expect(globbySync).toHaveBeenCalledWith(globs, expect.anything());
  });
});
