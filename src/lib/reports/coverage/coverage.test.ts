import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { File } from '../../files/files.ts';
import type { Import } from '../../imports/index.ts';

describe('coverage', async () => {
  const getFilesMock = mock.fn<() => File[]>(() => []);
  const getTrackedImportsMock = mock.fn();
  const summaryMock = mock.fn(() => ({ filesTracked: 0, filesWithImports: 0 }));

  const filesModule = mock.module('../../files/index.ts', {
    namedExports: { getFiles: getFilesMock },
  });
  const getTrackedImportsModule = mock.module('./get-tracked-imports.ts', {
    defaultExport: getTrackedImportsMock,
  });
  const summaryModule = mock.module('./summary.ts', { defaultExport: summaryMock });

  const coverage = (await import('./coverage.ts')).default;

  beforeEach(() => {
    getFilesMock.mock.resetCalls();
    getTrackedImportsMock.mock.resetCalls();
    summaryMock.mock.resetCalls();
  });

  after(() => {
    filesModule.restore();
    getTrackedImportsModule.restore();
    summaryModule.restore();
  });

  it('has a summary', () => {
    const sum = { filesTracked: 2, filesWithImports: 1 };
    summaryMock.mock.mockImplementationOnce(() => sum);

    assert.partialDeepStrictEqual(coverage(), { summary: sum });
  });

  it('has all tracked files', () => {
    const files = [
      { filePath: 'src/example1.ts', imports: new Set<Import>() },
      { filePath: 'src/example2.ts', imports: new Set<Import>() },
    ];
    const imports: Import[][] = [
      [],
      [
        {
          filePath: 'example.js',
          moduleNames: ['default'],
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
        },
      ],
    ];

    getFilesMock.mock.mockImplementationOnce(() => files);
    const importsMocked = [...imports];
    // @ts-expect-error undefined
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getTrackedImportsMock.mock.mockImplementation(() => importsMocked.shift()!);

    assert.partialDeepStrictEqual(coverage(), {
      files: [
        { filePath: 'src/example1.ts', trackedImports: imports[0] },
        { filePath: 'src/example2.ts', trackedImports: imports[1] },
      ],
    });
  });
});
