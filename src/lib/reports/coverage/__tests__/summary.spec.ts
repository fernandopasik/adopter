import { getFile, getFilePaths } from '../../../files/index.js';
import summary from '../summary.js';

jest.mock('../../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));
jest.mock('../../../files/index.js', () => ({
  getFile: jest.fn(),
  getFilePaths: jest.fn(() => []),
}));

const getFileMock = getFile as jest.MockedFunction<typeof getFile>;
const getFilePathsMock = getFilePaths as jest.MockedFunction<typeof getFilePaths>;

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
    expect(summary()).toStrictEqual(expect.objectContaining({ filesTracked: 2 }));
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
    expect(summary()).toStrictEqual(expect.objectContaining({ filesWithImports: 1 }));
  });
});
