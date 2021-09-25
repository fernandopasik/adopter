import log from 'loglevel';
import type { Import } from '../../imports/index.js';
import Coverage from '../coverage.js';
import Usage from '../usage.js';

jest.mock('loglevel');
jest.mock('nanocolors', () => ({
  bold: (t: string): string => t,
  dim: (t: string): string => t,
}));
jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));
jest.mock('../usage');

describe('coverage report', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('add file', () => {
    it('with no imports', () => {
      const usage = new Usage([]);
      const coverage = new Coverage(usage);
      const filePath = 'src/example.js';
      const imports: Import[] = [];

      coverage.addFile(filePath, imports);

      expect(coverage.getFile(filePath)).toStrictEqual({
        all: imports,
        librariesImports: [],
      });
    });

    it('with tracked package import', () => {
      const usage = new Usage([]);
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

    it('with untracked package import', () => {
      const usage = new Usage([]);
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

    it('with tracked and untracked package imports', () => {
      const usage = new Usage([]);
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

    it('with null package import', () => {
      const usage = new Usage([]);
      const spy = jest.spyOn(usage, 'hasModule').mockReturnValueOnce(true);
      const coverage = new Coverage(usage);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep',
          packageName: null,
          defaultName: 'dep',
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
  });

  it('creates a summary', () => {
    const usage = new Usage([]);
    const spy = jest.spyOn(usage, 'hasModule').mockReturnValueOnce(true);
    const coverage = new Coverage(usage);
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const filePath3 = 'src/example3.js';
    const imports = [
      {
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
        defaultName: 'dep1',
        moduleNames: ['default'],
      },
    ];

    coverage.addFile(filePath1, imports);
    coverage.addFile(filePath2, []);
    coverage.addFile(filePath3, []);

    expect(coverage.summary()).toStrictEqual({ filesTracked: 3, filesWithImports: 1 });

    spy.mockRestore();
  });

  it('prints the report', () => {
    const usage = new Usage([]);
    const spy1 = jest.spyOn(log, 'info').mockImplementation();
    const spy2 = jest.spyOn(usage, 'hasModule').mockReturnValueOnce(true);
    const coverage = new Coverage(usage);
    const filePath1 = 'src/example1.js';
    const filePath2 = 'src/example2.js';
    const imports = [
      {
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
        defaultName: 'dep1',
        moduleNames: ['default'],
      },
    ];

    coverage.addFile(filePath1, imports);
    coverage.addFile(filePath2, []);

    coverage.print();

    expect(spy1).toHaveBeenNthCalledWith(2, 'File Coverage');

    spy1.mockRestore();
    spy2.mockRestore();
  });
});
