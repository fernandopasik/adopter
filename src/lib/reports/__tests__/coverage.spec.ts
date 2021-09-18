import Coverage from '../coverage.js';
import Usage from '../usage.js';

jest.mock('../usage');

describe('coverage report', () => {
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
});
