import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getFile, getFilePaths, getFiles } from './files.ts';
import * as files from './index.ts';
import listFiles from './list-files.ts';
import processFiles from './process-files.ts';

describe('files', () => {
  it('get files', () => {
    assert.strictEqual(files.getFile, getFile);
  });

  it('get all filepaths', () => {
    assert.strictEqual(files.getFilePaths, getFilePaths);
  });

  it('get all files', () => {
    assert.strictEqual(files.getFiles, getFiles);
  });

  it('list files from glob', () => {
    assert.strictEqual(files.listFiles, listFiles);
  });

  it('process files', () => {
    assert.strictEqual(files.processFiles, processFiles);
  });
});
