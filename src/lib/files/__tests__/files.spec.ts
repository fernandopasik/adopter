import { addFile, addFileImports, files, getFile, getFilePaths, getFiles } from '../files.js';

describe('files', () => {
  beforeEach(() => {
    files.clear();
  });

  it('can add a file', () => {
    const filePath = 'src/example.js';
    expect(files.has(filePath)).toBe(false);
    addFile(filePath);
    expect(files.has(filePath)).toBe(true);
  });

  it('can not re add an existing file', () => {
    const filePath = 'src/example.js';
    addFile(filePath);
    const file = files.get(filePath);

    addFile(filePath);
    expect(file === files.get(filePath)).toBe(true);
  });

  it('can get a file', () => {
    const filePath = 'src/example.js';
    addFile(filePath);
    expect(getFile(filePath)).toStrictEqual({ filePath, imports: new Set() });
  });

  it('can not get a non existing file', () => {
    const filePath = 'src/non-existing-example.js';
    expect(getFile(filePath)).toBeUndefined();
  });

  it('can get all file paths', () => {
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const filePath3 = 'src/example3.js';

    addFile(filePath1);
    addFile(filePath2);
    addFile(filePath3);

    expect(getFilePaths()).toStrictEqual([filePath1, filePath2, filePath3]);
  });

  it('can get all files', () => {
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const filePath3 = 'src/example3.js';

    expect(getFilePaths()).toStrictEqual([]);

    addFile(filePath1);
    addFile(filePath2);
    addFile(filePath3);

    expect(getFiles()).toStrictEqual([
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
    expect(getFile(filePath)).toStrictEqual({ filePath, imports: new Set(imports) });
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
    expect(getFile(filePath)).toBeUndefined();
  });

  it('can add empty file imports', () => {
    const filePath = 'src/example.js';
    addFile(filePath);

    addFileImports(filePath);
    expect(getFile(filePath)).toStrictEqual({ filePath, imports: new Set() });
  });
});
