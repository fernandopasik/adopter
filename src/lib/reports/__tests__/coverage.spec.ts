import log from 'loglevel';
import Coverage from '../coverage.js';
import Usage from '../usage.js';

jest.mock('loglevel');
jest.mock('nanocolors', () => ({
  blue: (t: string): string => t,
  bold: (t: string): string => t,
}));

jest.mock('../usage');

describe('coverage report', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('add file', () => {
    it('from tracked package', () => {
      const usage = new Usage(new Map());
      const spy = jest.spyOn(usage, 'hasModule').mockReturnValueOnce(true);
      const coverage = new Coverage(usage);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
      ];

      coverage.addFile(filePath, imports);

      expect(coverage.getFile(filePath)).toStrictEqual({
        all: imports,
        librariesImports: [
          {
            packageName: 'dep1',
            moduleName: 'default',
          },
        ],
      });
      spy.mockRestore();
    });

    it('from untracked package', () => {
      const usage = new Usage(new Map());
      const spy = jest.spyOn(usage, 'hasModule').mockReturnValueOnce(false);
      const coverage = new Coverage(usage);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
      ];

      coverage.addFile(filePath, imports);

      expect(coverage.getFile(filePath)).toStrictEqual({
        all: imports,
        librariesImports: [],
      });
      spy.mockRestore();
    });

    it('from tracked and untracked packages', () => {
      const usage = new Usage(new Map());
      const spy = jest
        .spyOn(usage, 'hasModule')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);
      const coverage = new Coverage(usage);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
        {
          moduleSpecifier: 'dep2',
          packageName: 'dep2',
          defaultName: 'dep2',
          moduleNames: ['default'],
        },
      ];

      coverage.addFile(filePath, imports);

      expect(coverage.getFile(filePath)).toStrictEqual({
        all: imports,
        librariesImports: [
          {
            packageName: 'dep2',
            moduleName: 'default',
          },
        ],
      });
      spy.mockRestore();
    });
  });

  it('prints the report', () => {
    const usage = new Usage(new Map());
    const coverage = new Coverage(usage);
    const filePath = 'src/example.js';
    const imports = [
      {
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
        defaultName: 'dep1',
        moduleNames: ['default'],
      },
    ];

    coverage.addFile(filePath, imports);

    coverage.print();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(log.info).toHaveBeenNthCalledWith(1, 'Coverage Report\n');
  });
});
