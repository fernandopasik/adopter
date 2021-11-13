import { getFiles } from '../../../files/index.js';
import type { Import } from '../../../imports/index.js';
import coverage from '../coverage.js';
import getTrackedImports from '../get-tracked-imports.js';
import summary from '../summary.js';

jest.mock('../../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));
jest.mock('../../../files/index.js', () => ({
  getFiles: jest.fn().mockReturnValue([]),
}));
jest.mock('../get-tracked-imports.js');
jest.mock('../summary.js', () =>
  jest.fn().mockReturnValue({ filesTracked: 0, filesWithImports: 0 }),
);

const getFilesMock = getFiles as jest.MockedFunction<typeof getFiles>;
const getTrackedImportsMock = getTrackedImports as jest.MockedFunction<typeof getTrackedImports>;
const summaryMock = summary as jest.MockedFunction<typeof summary>;

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
