import log from 'loglevel';
import Usage from '../usage.js';

jest.mock('loglevel');
jest.mock('nanocolors', () => ({
  blue: (t: string): string => t,
  bold: (t: string): string => t,
}));

describe('usage report', () => {
  const packageExports = new Map([
    ['dep1', [{ name: 'default', type: 'function' }]],
    [
      'dep2',
      [
        { name: 'default', type: 'function' },
        { name: 'methodA', type: 'function' },
      ],
    ],
    [
      'dep3',
      [
        { name: 'methodA', type: 'function' },
        { name: 'methodB', type: 'function' },
      ],
    ],
  ]);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('get package names', () => {
    const usage = new Usage(packageExports);

    expect(usage.getPackageNames()).toStrictEqual(['dep1', 'dep2', 'dep3']);
  });

  describe('get package', () => {
    it('with existent', () => {
      const usage = new Usage(packageExports);

      expect(usage.getPackage('dep1')).toBeDefined();
    });

    it('with non existent', () => {
      const usage = new Usage(packageExports);

      expect(usage.getPackage('dep4')).toBeUndefined();
    });

    it('with non loaded', () => {
      const packageExports2 = new Map([['dep4', null]]);
      const usage = new Usage(packageExports2);

      expect(usage.getPackage('dep4')).toBeUndefined();
    });
  });

  describe('get module', () => {
    it('with existent', () => {
      const usage = new Usage(packageExports);

      expect(usage.getModule('dep1', 'default')).toBeDefined();
    });

    it('with non existent', () => {
      const usage = new Usage(packageExports);

      expect(usage.getModule('dep4', 'default')).toBeUndefined();
    });

    it('with non loaded', () => {
      const packageExports2 = new Map([['dep4', null]]);
      const usage = new Usage(packageExports2);

      expect(usage.getModule('dep4', 'default')).toBeUndefined();
    });
  });

  describe('has package', () => {
    it('finds a package', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasPackage('dep2')).toBe(true);
    });

    it('does not find a package', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasPackage('dep4')).toBe(false);
    });

    it('does not find a not loaded package', () => {
      const packageExports2 = new Map([['dep4', null]]);
      const usage = new Usage(packageExports2);

      expect(usage.hasPackage('dep4')).toBe(false);
    });
  });

  describe('has module', () => {
    it('finds a default module', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasModule('dep2', 'default')).toBe(true);
    });

    it('finds a named module', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasModule('dep2', 'methodA')).toBe(true);
    });

    it('does not find a package', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasModule('dep4', 'methodA')).toBe(false);
    });

    it('does not find a module', () => {
      const usage = new Usage(packageExports);

      expect(usage.hasModule('dep2', 'methodB')).toBe(false);
    });

    it('does not find a not loaded module', () => {
      const packageExports2 = new Map([['dep4', null]]);
      const usage = new Usage(packageExports2);

      expect(usage.hasModule('dep4', 'methodA')).toBe(false);
    });
  });

  describe('add imports', () => {
    it('with a default module', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
      ];

      expect(usage.isPackageUsed('dep1')).toBe(false);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(true);
    });

    it('with a named module', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep3',
          packageName: 'dep3',
          named: { methodA: 'methodA' },
          moduleNames: ['methodA'],
        },
      ];

      expect(usage.isPackageUsed('dep3')).toBe(false);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep3')).toBe(true);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(true);
    });

    it('with default and named modules', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep2',
          packageName: 'dep2',
          defaultName: 'dep2',
          named: { methodA: 'methodA' },
          moduleNames: ['default', 'methodA'],
        },
      ];

      expect(usage.isPackageUsed('dep2')).toBe(false);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(false);
      expect(usage.isModuleUsed('dep2', 'methodA')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep2')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'methodA')).toBe(true);
    });

    it('with no modules', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep1')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
    });

    it('with non existent module', () => {
      const packageExports2 = new Map([['dep4', null]]);
      const usage = new Usage(packageExports2);
      const filePath = 'src/example.js';

      const imports = [
        {
          moduleSpecifier: 'dep4',
          packageName: 'dep4',
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep4')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep4')).toBe(false);
    });

    it('with null imports module', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';

      const imports = [
        {
          moduleSpecifier: 'dep',
          packageName: null,
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep')).toBe(false);
    });

    it('with multiple imports', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep2',
          packageName: 'dep2',
          defaultName: 'dep2',
          moduleNames: ['default'],
        },
        {
          moduleSpecifier: 'dep3',
          packageName: 'dep3',
          named: { methodA: 'methodA' },
          moduleNames: ['methodA'],
        },
      ];

      expect(usage.isPackageUsed('dep2')).toBe(false);
      expect(usage.isPackageUsed('dep3')).toBe(false);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(false);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep2')).toBe(true);
      expect(usage.isPackageUsed('dep3')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(true);
    });

    it('with a non tracked package', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep4',
          packageName: 'dep4',
          defaultName: 'dep4',
          moduleNames: ['default'],
        },
      ];

      expect(usage.hasPackage('dep4')).toBe(false);
      expect(usage.hasModule('dep4', 'default')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.hasPackage('dep4')).toBe(false);
      expect(usage.hasModule('dep4', 'default')).toBe(false);
    });

    it('with a non tracked module', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          named: { methodA: 'methodA' },
          moduleNames: ['methodA'],
        },
      ];

      expect(usage.hasPackage('dep1')).toBe(true);
      expect(usage.isPackageUsed('dep1')).toBe(false);
      expect(usage.hasModule('dep1', 'methodA')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.hasModule('dep1', 'methodA')).toBe(false);
    });

    it('with tracked and non tracked packages', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          moduleNames: ['default'],
        },
        {
          moduleSpecifier: 'dep4',
          packageName: 'dep4',
          defaultName: 'dep4',
          moduleNames: ['default'],
        },
      ];

      expect(usage.isPackageUsed('dep1')).toBe(false);
      expect(usage.isPackageUsed('dep4')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isPackageUsed('dep4')).toBe(false);
    });

    it('with tracked and non tracked modules', () => {
      const usage = new Usage(packageExports);
      const filePath = 'src/example.js';
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          defaultName: 'dep1',
          named: { methodA: 'methodA' },
          moduleNames: ['default', 'methodA'],
        },
      ];

      expect(usage.isPackageUsed('dep1')).toBe(false);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(false);
      expect(usage.isModuleUsed('dep1', 'methodA')).toBe(false);

      usage.addImports(filePath, imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'methodA')).toBe(false);
    });
  });

  it('avoids duplicated modules', () => {
    const packageExports2 = new Map([
      ['dep1', [{ name: 'default', type: 'string' }]],
      ['dep1', [{ name: 'default', type: 'function' }]],
    ]);

    const usage = new Usage(packageExports2);

    expect(usage.hasModule('dep1', 'default')).toBe(true);
    expect(usage.getModule('dep1', 'default')).toStrictEqual({
      type: 'function',
      importedFrom: [],
    });
  });

  it('prints the report', () => {
    const spy = jest.spyOn(log, 'info').mockImplementation();
    const usage = new Usage(packageExports);

    const imports = [
      {
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
        defaultName: 'dep1',
        moduleNames: ['default'],
      },
    ];

    usage.addImports('example1.js', imports);

    usage.print();

    expect(spy).toHaveBeenNthCalledWith(1, 'Usage Report\n');

    spy.mockRestore();
  });
});
