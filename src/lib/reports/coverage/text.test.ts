import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import type { Coverage } from './coverage.ts';

describe('usage text report', async () => {
  const coverageMock = mock.fn<() => Coverage>();
  const coverageModule = mock.module('./coverage.ts', { defaultExport: coverageMock });

  const text = (await import('./text.ts')).default;

  beforeEach(() => {
    coverageMock.mock.resetCalls();
  });

  after(() => {
    coverageModule.restore();
  });

  const summary = {
    filesTracked: 2,
    filesWithImports: 1,
  };

  it('displays a title', () => {
    coverageMock.mock.mockImplementationOnce(() => ({ files: [], summary }));

    assert.match(text(), /Imported Packages and Modules Coverage/u);
  });

  it('displays a sumary', () => {
    coverageMock.mock.mockImplementationOnce(() => ({ files: [], summary }));

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
    coverageMock.mock.mockImplementationOnce(() => ({ files, summary }));

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
    coverageMock.mock.mockImplementationOnce(() => ({ files, summary }));

    const usageText = text();

    assert.match(usageText, /src\/example1.ts/u);
    assert.match(usageText, /dep1.*\/.*default,methodA/u);
    assert.match(usageText, /src\/example2.ts/u);
    assert.match(usageText, /dep2.*\/.*default/u);
    assert.match(usageText, /src\/example3.ts/u);
  });
});
