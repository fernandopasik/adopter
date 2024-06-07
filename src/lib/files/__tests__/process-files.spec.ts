import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import fs from 'fs';
import type ts from 'typescript';
import { parseImports, type Import } from '../../imports/index.js';
import { addFile, addFileImports } from '../files.js';
import parseAst from '../parse-ast.js';
import processFiles from '../process-files.js';

jest.mock('fs');
jest.mock('../parse-ast.js', () => jest.fn());
jest.mock('../../imports/index.js', () => ({
  parseImports: jest.fn(),
}));
jest.mock('../files.js');

describe('process files', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('reads reads from provided list', () => {
    const files = ['example1.js', 'folder/example2.js', '/another/example3.ts'];
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
      const files = ['example1.js', 'folder/example2.js', '/another/example3.ts'];
      const spy = jest.spyOn(fs, 'readFileSync');
      const callback = jest.fn();

      processFiles(files, callback);

      expect(spy).toHaveBeenCalledTimes(files.length);
      expect(callback).toHaveBeenCalledTimes(files.length);

      spy.mockRestore();
    });

    it('with file path', () => {
      const files = ['example1.js', 'folder/example2.js'];
      const callback = jest.fn();

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
      const filenames = ['example1.js', 'example2.js'];
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const files = [filenames[0]!, `folder/${filenames[1]}`];
      const callback = jest.fn();

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
      const files = ['example1.js', 'example2.js'];
      const contents = ['this is example1', 'this is example2'];
      const callback = jest.fn();

      jest
        .mocked(fs.readFileSync)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .mockReturnValueOnce(contents[0]!)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .mockReturnValueOnce(contents[1]!);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], contents[0], undefined, undefined);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], contents[1], undefined, undefined);
    });

    it('with file asts', () => {
      const files = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }];
      const callback = jest.fn();

      jest
        .mocked(parseAst)
        .mockReturnValueOnce(asts[0] as ts.SourceFile)
        .mockReturnValueOnce(asts[1] as ts.SourceFile);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], undefined, asts[0], undefined);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], undefined, asts[1], undefined);
    });

    it('with file imports', () => {
      const files = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }];
      const imports: Import[] = [
        {
          filePath: 'example1.js',
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
      ];
      const callback = jest.fn();

      jest
        .mocked(parseAst)
        .mockReturnValueOnce(asts[0] as ts.SourceFile)
        .mockReturnValueOnce(asts[1] as ts.SourceFile);

      jest.mocked(parseImports).mockReturnValueOnce(imports);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], undefined, asts[0], imports);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], undefined, asts[1], undefined);
    });

    it('add file and file imports', () => {
      const files = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }];
      const imports: Import[] = [
        {
          filePath: 'example1.js',
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
      ];

      jest
        .mocked(parseAst)
        .mockReturnValueOnce(asts[0] as ts.SourceFile)
        .mockReturnValueOnce(asts[1] as ts.SourceFile);

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
