import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { getFiles } from '../../files/index.ts';
import type { Import } from '../../imports/index.ts';
import coverage from './coverage.ts';
import getTrackedImports from './get-tracked-imports.ts';
import summary from './summary.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));
jest.mock('../../files/index.ts', () => ({
  getFiles: jest.fn().mockReturnValue([]),
}));
jest.mock('./get-tracked-imports.ts');
jest.mock('./summary.ts', () =>
  jest.fn().mockReturnValue({ filesTracked: 0, filesWithImports: 0 }),
);

const getFilesMock = jest.mocked(getFiles);
const getTrackedImportsMock = jest.mocked(getTrackedImports);
const summaryMock = jest.mocked(summary);

describe('coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('has a summary', () => {
    const sum = { filesTracked: 2, filesWithImports: 1 };
    summaryMock.mockReturnValueOnce(sum);

    expect(coverage()).toStrictEqual(expect.objectContaining({ summary: sum }));
  });

  it('has all tracked files', () => {
    const files = [
      { filePath: 'src/example1.ts', imports: new Set<Import>() },
      { filePath: 'src/example2.ts', imports: new Set<Import>() },
    ];
    const imports = [
      {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      },
    ];

    getFilesMock.mockReturnValueOnce(files);
    getTrackedImportsMock.mockReturnValueOnce([]).mockReturnValueOnce(imports);

    expect(coverage()).toStrictEqual(
      expect.objectContaining({
        files: [
          { filePath: 'src/example1.ts', trackedImports: [] },
          { filePath: 'src/example2.ts', trackedImports: imports },
        ],
      }),
    );
  });
});
