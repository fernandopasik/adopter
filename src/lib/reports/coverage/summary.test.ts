import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { getFile, getFilePaths } from '../../files/index.ts';
import summary from './summary.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));
jest.mock('../../files/index.ts', () => ({
  getFile: jest.fn(),
  getFilePaths: jest.fn(() => []),
}));

const getFileMock = jest.mocked(getFile);
const getFilePathsMock = jest.mocked(getFilePaths);

describe('coverage summary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('empty report', () => {
    expect(summary()).toStrictEqual({
      filesTracked: 0,
      filesWithImports: 0,
    });
  });

  it('tracks ammount of files', () => {
    const filePaths = ['src/example1.ts', 'src/example2.ts'];
    getFilePathsMock.mockReturnValueOnce(filePaths);
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
    getFilePathsMock.mockReturnValueOnce(filePaths);
    getFileMock.mockReturnValueOnce({ filePath: 'src/example1.ts', imports: new Set(imports) });
    assert.partialDeepStrictEqual(summary(), { filesWithImports: 1 });
  });
});
