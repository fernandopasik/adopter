import { describe, expect, it, jest } from '@jest/globals';
import { getFile, getFilePaths, getFiles } from './files.ts';
import * as imports from './index.ts';
import listFiles from './list-files.ts';
import processFiles from './process-files.ts';

jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('files', () => {
  it('get files', () => {
    expect(imports.getFile).toStrictEqual(getFile);
  });

  it('get all filepaths', () => {
    expect(imports.getFilePaths).toStrictEqual(getFilePaths);
  });

  it('get all files', () => {
    expect(imports.getFiles).toStrictEqual(getFiles);
  });

  it('list files from glob', () => {
    expect(imports.listFiles).toStrictEqual(listFiles);
  });

  it('process files', () => {
    expect(imports.processFiles).toStrictEqual(processFiles);
  });
});
