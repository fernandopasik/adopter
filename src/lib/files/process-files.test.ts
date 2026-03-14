import { beforeEach, describe, it, jest } from '@jest/globals';
import fs from 'fs';
import assert from 'node:assert/strict';
import type { SourceFile } from 'typescript';
import { parseImports, type Import } from '../imports/index.ts';
import { addFile, addFileImports } from './files.ts';
import parseAst from './parse-ast.ts';
import processFiles, { type Callback } from './process-files.ts';

const addFileMock = jest.mocked(addFile);
const addFileImportsMock = jest.mocked(addFileImports);

jest.mock('fs');
jest.mock('./parse-ast.ts', () => jest.fn());
jest.mock('../imports/index.ts', () => ({ parseImports: jest.fn() }));
jest.mock('./files.ts');

describe('process files', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('reads reads from provided list', () => {
    const files: [string, string, string] = [
      'example1.js',
      'folder/example2.js',
      '/another/example3.ts',
    ];
    const spy = jest.spyOn(fs, 'readFileSync');

    processFiles(files);

    assert.strictEqual(spy.mock.calls.length, files.length);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), [files[0], 'utf8']);
    assert.partialDeepStrictEqual(spy.mock.calls.at(1), [files[1], 'utf8']);
    assert.partialDeepStrictEqual(spy.mock.calls.at(2), [files[2], 'utf8']);

    spy.mockRestore();
  });

  it('with empty list', () => {
    const spy = jest.spyOn(fs, 'readFileSync');

    processFiles();

    assert.strictEqual(spy.mock.calls.length, 0);

    spy.mockRestore();
  });

  describe('executes callback', () => {
    it('on each file', () => {
      const files: [string, string, string] = [
        'example1.js',
        'folder/example2.js',
        '/another/example3.ts',
      ];
      const spy = jest.spyOn(fs, 'readFileSync');
      const callback = jest.fn<Callback>();

      processFiles(files, callback);

      assert.strictEqual(spy.mock.calls.length, files.length);
      assert.strictEqual(callback.mock.calls.length, files.length);

      spy.mockRestore();
    });

    it('with file path', () => {
      const files: [string, string] = ['example1.js', 'folder/example2.js'];
      const callback = jest.fn<Callback>();

      processFiles(files, callback);

      assert.partialDeepStrictEqual(callback.mock.calls.at(0), [
        files[0],
        undefined,
        undefined,
        undefined,
      ]);
      assert.partialDeepStrictEqual(callback.mock.calls.at(1), [
        files[1],
        undefined,
        undefined,
        undefined,
      ]);
    });

    it('with filename', () => {
      const filenames: [string, string] = ['example1.js', 'example2.js'];
      const files: [string, string] = [filenames[0], `folder/${filenames[1]}`];
      const callback = jest.fn<Callback>();

      processFiles(files, callback);

      assert.partialDeepStrictEqual(callback.mock.calls.at(0), [
        files[0],
        filenames[0],
        undefined,
        undefined,
        undefined,
      ]);
      assert.partialDeepStrictEqual(callback.mock.calls.at(1), [
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
      const callback = jest.fn<Callback>();

      jest
        .mocked(fs.readFileSync)
        .mockReturnValueOnce(contents[0])
        .mockReturnValueOnce(contents[1]);

      processFiles(files, callback);

      assert.partialDeepStrictEqual(callback.mock.calls.at(0), [
        files[0],
        files[0],
        contents[0],
        undefined,
        undefined,
      ]);
      assert.partialDeepStrictEqual(callback.mock.calls.at(1), [
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
      const callback = jest.fn<Callback>();

      jest.mocked(parseAst).mockReturnValueOnce(asts[0]).mockReturnValueOnce(asts[1]);

      processFiles(files, callback);

      assert.partialDeepStrictEqual(callback.mock.calls.at(0), [
        files[0],
        files[0],
        undefined,
        asts[0],
        undefined,
      ]);
      assert.partialDeepStrictEqual(callback.mock.calls.at(1), [
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
      const callback = jest.fn<Callback>();

      jest.mocked(parseAst).mockReturnValueOnce(asts[0]).mockReturnValueOnce(asts[1]);

      jest.mocked(parseImports).mockReturnValueOnce(imports);

      processFiles(files, callback);

      assert.partialDeepStrictEqual(callback.mock.calls.at(0), [
        files[0],
        files[0],
        undefined,
        asts[0],
        imports,
      ]);
      assert.partialDeepStrictEqual(callback.mock.calls.at(1), [
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

      jest.mocked(parseAst).mockReturnValueOnce(asts[0]).mockReturnValueOnce(asts[1]);

      jest.mocked(parseImports).mockReturnValueOnce(imports);

      processFiles(files);

      assert.strictEqual(addFileMock.mock.calls.length, files.length);
      assert.partialDeepStrictEqual(addFileMock.mock.calls.at(0), [files[0]]);
      assert.partialDeepStrictEqual(addFileMock.mock.calls.at(1), [files[1]]);
      assert.strictEqual(addFileImportsMock.mock.calls.length, files.length);
      assert.partialDeepStrictEqual(addFileImportsMock.mock.calls.at(0), [files[0], imports]);
      assert.partialDeepStrictEqual(addFileImportsMock.mock.calls.at(1), [files[1], undefined]);
    });
  });
});
