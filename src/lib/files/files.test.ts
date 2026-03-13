import { beforeEach, describe, it } from '@jest/globals';
import assert from 'node:assert/strict';
import { addFile, addFileImports, files, getFile, getFilePaths, getFiles } from './files.ts';

describe('files', () => {
  beforeEach(() => {
    files.clear();
  });

  it('can add a file', () => {
    const filePath = 'src/example.js';
    assert.strictEqual(files.has(filePath), false);
    addFile(filePath);
    assert.strictEqual(files.has(filePath), true);
  });

  it('can not re add an existing file', () => {
    const filePath = 'src/example.js';
    addFile(filePath);
    const file = files.get(filePath);

    addFile(filePath);
    assert.strictEqual(file, files.get(filePath));
  });

  it('can get a file', () => {
    const filePath = 'src/example.js';
    addFile(filePath);
    assert.deepStrictEqual(getFile(filePath), { filePath, imports: new Set() });
  });

  it('can not get a non existing file', () => {
    const filePath = 'src/non-existing-example.js';
    assert.strictEqual(getFile(filePath), undefined);
  });

  it('can get all file paths', () => {
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const filePath3 = 'src/example3.js';

    addFile(filePath1);
    addFile(filePath2);
    addFile(filePath3);

    assert.deepStrictEqual(getFilePaths(), [filePath1, filePath2, filePath3]);
  });

  it('can get all files', () => {
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const filePath3 = 'src/example3.js';

    assert.deepStrictEqual(getFilePaths(), []);

    addFile(filePath1);
    addFile(filePath2);
    addFile(filePath3);

    assert.deepStrictEqual(getFiles(), [
      { filePath: filePath1, imports: new Set() },
      { filePath: filePath2, imports: new Set() },
      { filePath: filePath3, imports: new Set() },
    ]);
  });

  it('can add file imports', () => {
    const imports = [
      {
        filePath: 'src/example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      },
      {
        filePath: 'src/example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep2',
        packageName: 'dep2',
      },
    ];
    const filePath = 'src/example.js';
    addFile(filePath);

    addFileImports(filePath, imports);
    assert.deepStrictEqual(getFile(filePath), { filePath, imports: new Set(imports) });
  });

  it('can not add imports to non existent file', () => {
    const imports = [
      {
        filePath: 'src/example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      },
    ];
    const filePath = 'src/example.js';

    addFileImports(filePath, imports);
    assert.strictEqual(getFile(filePath), undefined);
  });

  it('can add empty file imports', () => {
    const filePath = 'src/example.js';
    addFile(filePath);

    addFileImports(filePath);
    assert.deepStrictEqual(getFile(filePath), { filePath, imports: new Set() });
  });
});
