import fs from 'fs';
import type ts from 'typescript';
import parseAst from '../parse-ast.js';
import processFiles from '../process-files.js';

jest.mock('fs', () => ({ readFileSync: jest.fn() }));

jest.mock('../parse-ast', () => jest.fn());

describe('process files', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('reads reads from provided list', () => {
    const files = ['example1.js', 'folder/example2.js', '/another/example3.ts'];

    processFiles(files);

    expect(fs.readFileSync).toHaveBeenCalledTimes(files.length);
    expect(fs.readFileSync).toHaveBeenCalledWith(files[0], 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith(files[1], 'utf8');
    expect(fs.readFileSync).toHaveBeenCalledWith(files[2], 'utf8');
  });

  it('with empty list', () => {
    processFiles();

    expect(fs.readFileSync).toHaveBeenCalledTimes(0);
  });

  describe('executes callback', () => {
    it('on each file', () => {
      const files = ['example1.js', 'folder/example2.js', '/another/example3.ts'];
      const callback = jest.fn();

      processFiles(files, callback);

      expect(fs.readFileSync).toHaveBeenCalledTimes(files.length);
      expect(callback).toHaveBeenCalledTimes(files.length);
    });

    it('with file path', () => {
      const files = ['example1.js', 'folder/example2.js'];
      const callback = jest.fn();

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], expect.anything(), undefined, undefined);
      expect(callback).toHaveBeenCalledWith(files[1], expect.anything(), undefined, undefined);
    });

    it('with filename', () => {
      const filenames = ['example1.js', 'example2.js'];
      const files = [filenames[0], `folder/${filenames[1]}`];
      const callback = jest.fn();

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], filenames[0], undefined, undefined);
      expect(callback).toHaveBeenCalledWith(files[1], filenames[1], undefined, undefined);
    });

    it('with file contents', () => {
      const files = ['example1.js', 'example2.js'];
      const contents = ['this is example1', 'this is example2'];
      const callback = jest.fn();

      (fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>)
        .mockReturnValueOnce(contents[0])
        .mockReturnValueOnce(contents[1]);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], contents[0], undefined);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], contents[1], undefined);
    });

    it('with file asts', () => {
      const files = ['example1.js', 'example2.js'];
      const asts = [{ fileName: files[0] }, { fileName: files[1] }];
      const callback = jest.fn();

      (parseAst as jest.MockedFunction<typeof parseAst>)
        .mockReturnValueOnce(asts[0] as ts.SourceFile)
        .mockReturnValueOnce(asts[1] as ts.SourceFile);

      processFiles(files, callback);

      expect(callback).toHaveBeenCalledWith(files[0], files[0], undefined, asts[0]);
      expect(callback).toHaveBeenCalledWith(files[1], files[1], undefined, asts[1]);
    });
  });
});
