import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import coverage from '../coverage.js';
import text from '../text.js';

jest.mock('../coverage.js');
jest.mock('../../../packages/resolve-package.js', () =>
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

    expect(text()).toContain('Imported Packages and Modules Coverage');
  });

  it('displays a sumary', () => {
    coverageMock.mockReturnValueOnce({ files: [], summary });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('Files Tracked.*2'));
    expect(usageText).toStrictEqual(expect.stringMatching('Files with Imports.*1'));
  });

  it('displays files', () => {
    const files = [
      { filePath: 'src/example1.ts', trackedImports: [] },
      { filePath: 'src/example2.ts', trackedImports: [] },
      { filePath: 'src/example3.ts', trackedImports: [] },
    ];
    coverageMock.mockReturnValueOnce({ files, summary });

    const usageText = text();

    expect(usageText).toStrictEqual(expect.stringMatching('src/example1.ts'));
    expect(usageText).toStrictEqual(expect.stringMatching('src/example2.ts'));
    expect(usageText).toStrictEqual(expect.stringMatching('src/example3.ts'));
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

    expect(usageText).toStrictEqual(expect.stringMatching('src/example1.ts'));
    expect(usageText).toStrictEqual(expect.stringMatching('dep1.*/.*default,methodA'));
    expect(usageText).toStrictEqual(expect.stringMatching('src/example2.ts'));
    expect(usageText).toStrictEqual(expect.stringMatching('dep2.*/.*default'));
    expect(usageText).toStrictEqual(expect.stringMatching('src/example3.ts'));
  });
});
