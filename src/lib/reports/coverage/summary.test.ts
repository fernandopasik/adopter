import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { File } from '../../files/files.ts';

describe('coverage summary', async () => {
  const getFileMock = mock.fn<() => File>();
  const getFilePathsMock = mock.fn<() => string[]>(() => []);

  const filesModule = mock.module('../../files/index.ts', {
    namedExports: { getFile: getFileMock, getFilePaths: getFilePathsMock },
  });

  const summary = (await import('./summary.ts')).default;

  beforeEach(() => {
    getFileMock.mock.resetCalls();
    getFilePathsMock.mock.resetCalls();
  });

  after(() => {
    filesModule.restore();
  });

  it('empty report', () => {
    assert.deepStrictEqual(summary(), {
      filesTracked: 0,
      filesWithImports: 0,
    });
  });

  it('tracks ammount of files', () => {
    const filePaths = ['src/example1.ts', 'src/example2.ts'];
    getFilePathsMock.mock.mockImplementationOnce(() => filePaths);
    assert.partialDeepStrictEqual(summary(), { filesTracked: 2 });
  });

  it('tracks ammount of files with imports', () => {
    const filePaths = ['src/example1.ts', 'src/example2.ts', 'src/example3.ts'];
    const imports = [
      {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      },
    ];
    getFilePathsMock.mock.mockImplementationOnce(() => filePaths);
    getFileMock.mock.mockImplementationOnce(() => ({
      filePath: 'src/example1.ts',
      imports: new Set(imports),
    }));
    assert.partialDeepStrictEqual(summary(), { filesWithImports: 1 });
  });
});
