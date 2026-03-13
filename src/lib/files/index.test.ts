import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { getFile, getFilePaths, getFiles } from './files.ts';
import * as imports from './index.ts';
import listFiles from './list-files.ts';
import processFiles from './process-files.ts';

jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('files', () => {
  it('get files', () => {
    assert.strictEqual(imports.getFile, getFile);
  });

  it('get all filepaths', () => {
    assert.strictEqual(imports.getFilePaths, getFilePaths);
  });

  it('get all files', () => {
    assert.strictEqual(imports.getFiles, getFiles);
  });

  it('list files from glob', () => {
    assert.strictEqual(imports.listFiles, listFiles);
  });

  it('process files', () => {
    assert.strictEqual(imports.processFiles, processFiles);
  });
});
