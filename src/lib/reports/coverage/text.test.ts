import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import coverage from './coverage.ts';
import text from './text.ts';

jest.mock('./coverage.ts');
jest.mock('../../packages/resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

const coverageMock = jest.mocked(coverage);

describe('usage text report', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const summary = {
    filesTracked: 2,
    filesWithImports: 1,
  };

  it('displays a title', () => {
    coverageMock.mockReturnValueOnce({ files: [], summary });

    assert.match(text(), /Imported Packages and Modules Coverage/u);
  });

  it('displays a sumary', () => {
    coverageMock.mockReturnValueOnce({ files: [], summary });

    const usageText = text();

    assert.match(usageText, /Files Tracked.*2/u);
    assert.match(usageText, /Files with Imports.*1/u);
  });

  it('displays files', () => {
    const files = [
      { filePath: 'src/example1.ts', trackedImports: [] },
      { filePath: 'src/example2.ts', trackedImports: [] },
      { filePath: 'src/example3.ts', trackedImports: [] },
    ];
    coverageMock.mockReturnValueOnce({ files, summary });

    const usageText = text();

    assert.match(usageText, /src\/example1.ts/u);
    assert.match(usageText, /src\/example2.ts/u);
    assert.match(usageText, /src\/example3.ts/u);
  });

  it('displays files with tracked packages', () => {
    const trackedImports = [
      { moduleNames: ['default', 'methodA'], packageName: 'dep1' },
      { moduleNames: ['default'], packageName: 'dep2' },
    ];
    const files = [
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      { filePath: 'src/example1.ts', trackedImports: [trackedImports[0]!] },
      { filePath: 'src/example2.ts', trackedImports },
      { filePath: 'src/example3.ts', trackedImports: [] },
    ];
    coverageMock.mockReturnValueOnce({ files, summary });

    const usageText = text();

    assert.match(usageText, /src\/example1.ts/u);
    assert.match(usageText, /dep1.*\/.*default,methodA/u);
    assert.match(usageText, /src\/example2.ts/u);
    assert.match(usageText, /dep2.*\/.*default/u);
    assert.match(usageText, /src\/example3.ts/u);
  });
});
