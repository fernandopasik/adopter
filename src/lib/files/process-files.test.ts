import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { SourceFile } from 'typescript';
import type { Import } from '../imports/index.ts';
import type { Callback } from './process-files.ts';

describe('process files', async () => {
  const addFileMock = mock.fn();
  const addFileImportsMock = mock.fn();
  const parseAstMock = mock.fn<() => SourceFile>();
  const parseImportsMock = mock.fn<() => Import[]>();
  const readFileSyncMock = mock.fn<() => string>();

  const filesModule = mock.module('./files.ts', {
    namedExports: { addFile: addFileMock, addFileImports: addFileImportsMock },
  });
  const fsModule = mock.module('node:fs', { namedExports: { readFileSync: readFileSyncMock } });
  const importsModule = mock.module('../imports/index.ts', {
    namedExports: { parseImports: parseImportsMock },
  });
  const parseAstModule = mock.module('./parse-ast.ts', { defaultExport: parseAstMock });

  const processFiles = (await import('./process-files.ts')).default;

  beforeEach(() => {
    addFileMock.mock.resetCalls();
    addFileImportsMock.mock.resetCalls();
    parseAstMock.mock.resetCalls();
    parseImportsMock.mock.resetCalls();
    readFileSyncMock.mock.resetCalls();
  });

  after(() => {
    filesModule.restore();
    fsModule.restore();
    importsModule.restore();
    parseAstModule.restore();
  });

  it('reads reads from provided list', () => {
    const files: [string, string, string] = [
      'example1.js',
      'folder/example2.js',
      '/another/example3.ts',
    ];

    processFiles(files);

    assert.strictEqual(readFileSyncMock.mock.calls.length, files.length);
    assert.deepStrictEqual(readFileSyncMock.mock.calls.at(0)?.arguments, [files[0], 'utf8']);
    assert.deepStrictEqual(readFileSyncMock.mock.calls.at(1)?.arguments, [files[1], 'utf8']);
    assert.deepStrictEqual(readFileSyncMock.mock.calls.at(2)?.arguments, [files[2], 'utf8']);
  });

  it('with empty list', () => {
    processFiles();

    assert.strictEqual(readFileSyncMock.mock.calls.length, 0);
  });

  describe('executes callback', () => {
    it('on each file', () => {
      const files: [string, string, string] = [
        'example1.js',
        'folder/example2.js',
        '/another/example3.ts',
      ];

      const callback = mock.fn<Callback>();

      processFiles(files, callback);

      assert.strictEqual(readFileSyncMock.mock.calls.length, files.length);
      assert.strictEqual(callback.mock.calls.length, files.length);
    });

    it('with file path', () => {
      const filenames: [string, string] = ['example1.js', 'example2.js'];
      const files: [string, string] = [filenames[0], `folder/${filenames[1]}`];
      const callback = mock.fn<Callback>();

      processFiles(files, callback);

      assert.deepStrictEqual(callback.mock.calls.at(0)?.arguments, [
        files[0],
        filenames[0],
        undefined,
        undefined,
        undefined,
      ]);
      assert.deepStrictEqual(callback.mock.calls.at(1)?.arguments, [
        files[1],
        filenames[1],
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('with filename', () => {
      const filenames: [string, string] = ['example1.js', 'example2.js'];
      const files: [string, string] = [filenames[0], `folder/${filenames[1]}`];
      const callback = mock.fn<Callback>();

      processFiles(files, callback);

      assert.deepStrictEqual(callback.mock.calls.at(0)?.arguments, [
        files[0],
        filenames[0],
        undefined,
        undefined,
        undefined,
      ]);
      assert.deepStrictEqual(callback.mock.calls.at(1)?.arguments, [
        files[1],
        filenames[1],
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('with file contents', () => {
      const files: [string, string] = ['example1.js', 'example2.js'];
      const contents: [string, string] = ['this is example1', 'this is example2'];
      const callback = mock.fn<Callback>();

      const contentsMock = [...contents];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      readFileSyncMock.mock.mockImplementation(() => contentsMock.shift()!);

      processFiles(files, callback);

      assert.strictEqual(callback.mock.callCount(), 2);

      assert.deepStrictEqual(callback.mock.calls.at(0)?.arguments, [
        files[0],
        files[0],
        contents[0],
        undefined,
        undefined,
      ]);
      assert.deepStrictEqual(callback.mock.calls.at(1)?.arguments, [
        files[1],
        files[1],
        contents[1],
        undefined,
        undefined,
      ]);
    });

    it('with file asts', () => {
      const files: [string, string] = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }] as [SourceFile, SourceFile];
      const callback = mock.fn<Callback>();

      const astsMock = [...asts];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseAstMock.mock.mockImplementation(() => astsMock.shift()!);

      processFiles(files, callback);

      assert.deepStrictEqual(callback.mock.calls.at(0)?.arguments, [
        files[0],
        files[0],
        undefined,
        asts[0],
        undefined,
      ]);
      assert.deepStrictEqual(callback.mock.calls.at(1)?.arguments, [
        files[1],
        files[1],
        undefined,
        asts[1],
        undefined,
      ]);
    });

    it('with file imports', () => {
      const files: [string, string] = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }] as [SourceFile, SourceFile];
      const imports: Import[] = [
        {
          defaultName: 'dep1',
          filePath: 'example1.js',
          moduleNames: ['default'],
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
        },
      ];
      const callback = mock.fn<Callback>();

      const astsMock = [...asts];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      parseAstMock.mock.mockImplementation(() => astsMock.shift()!);

      parseImportsMock.mock.mockImplementationOnce(() => imports);

      processFiles(files, callback);

      assert.deepStrictEqual(callback.mock.calls.at(0)?.arguments, [
        files[0],
        files[0],
        undefined,
        asts[0],
        imports,
      ]);
      assert.deepStrictEqual(callback.mock.calls.at(1)?.arguments, [
        files[1],
        files[1],
        undefined,
        asts[1],
        undefined,
      ]);
    });

    it('add file and file imports', () => {
      const files: [string, string] = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }] as [SourceFile, SourceFile];
      const imports: Import[] = [
        {
          defaultName: 'dep1',
          filePath: 'example1.js',
          moduleNames: ['default'],
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
        },
      ];

      parseAstMock.mock.mockImplementationOnce(() => asts[0]);
      parseAstMock.mock.mockImplementationOnce(() => asts[1]);

      parseImportsMock.mock.mockImplementationOnce(() => imports);

      processFiles(files);

      assert.strictEqual(addFileMock.mock.calls.length, files.length);
      assert.deepStrictEqual(addFileMock.mock.calls.at(0)?.arguments, [files[0]]);
      assert.deepStrictEqual(addFileMock.mock.calls.at(1)?.arguments, [files[1]]);
      assert.strictEqual(addFileImportsMock.mock.calls.length, files.length);
      assert.deepStrictEqual(addFileImportsMock.mock.calls.at(0)?.arguments, [files[0], imports]);
      assert.deepStrictEqual(addFileImportsMock.mock.calls.at(1)?.arguments, [files[1], undefined]);
    });
  });
});
