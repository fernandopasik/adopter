import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import fs from 'fs';
import type { SourceFile } from 'typescript';
import { parseImports, type Import } from '../imports/index.ts';
import { addFile, addFileImports } from './files.ts';
import parseAst from './parse-ast.ts';
import processFiles, { type Callback } from './process-files.ts';

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

    expect(spy).toHaveBeenCalledTimes(files.length);
    expect(spy).toHaveBeenCalledWith(files[0], 'utf8');
    expect(spy).toHaveBeenCalledWith(files[1], 'utf8');
    expect(spy).toHaveBeenCalledWith(files[2], 'utf8');

    spy.mockRestore();
  });

  it('with empty list', () => {
    const spy = jest.spyOn(fs, 'readFileSync');

    processFiles();

    expect(spy).toHaveBeenCalledTimes(0);

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

      expect(spy).toHaveBeenCalledTimes(files.length);
      expect(callback).toHaveBeenCalledTimes(files.length);

      spy.mockRestore();
    });

    it('with file path', () => {
      const files: [string, string] = ['example1.js', 'folder/example2.js'];
      const callback = jest.fn<Callback>();

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(
        files[0],
        expect.anything(),
        undefined,
        undefined,
        undefined,
      );
      expect(callback).toHaveBeenCalledWith(
        files[1],
        expect.anything(),
        undefined,
        undefined,
        undefined,
      );
    });

    it('with filename', () => {
      const filenames: [string, string] = ['example1.js', 'example2.js'];
      const files: [string, string] = [filenames[0], `folder/${filenames[1]}`];
      const callback = jest.fn<Callback>();

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(
        files[0],
        filenames[0],
        undefined,
        undefined,
        undefined,
      );
      expect(callback).toHaveBeenCalledWith(
        files[1],
        filenames[1],
        undefined,
        undefined,
        undefined,
      );
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

      expect(callback).toHaveBeenCalledWith(files[0], files[0], contents[0], undefined, undefined);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], contents[1], undefined, undefined);
    });

    it('with file asts', () => {
      const files: [string, string] = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }] as [SourceFile, SourceFile];
      const callback = jest.fn<Callback>();

      jest.mocked(parseAst).mockReturnValueOnce(asts[0]).mockReturnValueOnce(asts[1]);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], undefined, asts[0], undefined);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], undefined, asts[1], undefined);
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

      expect(callback).toHaveBeenCalledWith(files[0], files[0], undefined, asts[0], imports);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], undefined, asts[1], undefined);
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

      expect(addFile).toHaveBeenCalledTimes(2);
      expect(addFile).toHaveBeenCalledWith(files[0]);
      expect(addFile).toHaveBeenCalledWith(files[1]);
      expect(addFileImports).toHaveBeenCalledTimes(2);
      expect(addFileImports).toHaveBeenCalledWith(files[0], imports);
      expect(addFileImports).toHaveBeenCalledWith(files[1], undefined);
    });
  });
});
