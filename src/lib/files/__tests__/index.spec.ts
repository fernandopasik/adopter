import * as imports from '../index.js';
import listFiles from '../list-files.js';

jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

describe('files', () => {
  it('list files from glob', () => {
    expect(imports.listFiles).toStrictEqual(listFiles);
  });
});
