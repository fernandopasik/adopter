import * as imports from '../index.js';
import listFiles from '../list-files.js';
import processFiles from '../process-files.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

describe('files', () => {
  it('list files from glob', () => {
    expect(imports.listFiles).toStrictEqual(listFiles);
  });

  it('process files', () => {
    expect(imports.processFiles).toStrictEqual(processFiles);
  });
});
