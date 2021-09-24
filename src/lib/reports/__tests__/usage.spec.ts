import log from 'loglevel';
import { getPackageModules } from '../../packages/index.js';
import Usage from '../usage.js';

jest.mock('loglevel');
jest.mock('nanocolors', () => ({
  blue: (t: string): string => t,
  bold: (t: string): string => t,
}));

jest.mock('../../packages', () => ({
  getPackageModules: jest.fn(() => []),
  resolvePackage: jest.fn((specifier: string) => specifier),
}));

describe('usage report', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('get package names', () => {
    const packageNames = ['dep1', 'dep2', 'dep3'];
    const usage = new Usage(packageNames);

    expect(usage.getPackageNames()).toStrictEqual(packageNames);
  });

  describe('get package', () => {
    it('with existent', async () => {
      const usage = new Usage(['dep1']);
      await usage.init();

      expect(usage.getPackage('dep1')).toBeDefined();
    });

    it('with non existent', async () => {
      const usage = new Usage([]);
      await usage.init();

      expect(usage.getPackage('dep4')).toBeUndefined();
    });
  });

  describe('get module', () => {
    it('with existent', async () => {
      const usage = new Usage(['dep1']);
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      await usage.init();

      expect(usage.getModule('dep1', 'default')).toBeDefined();
    });

    it('with non existent', async () => {
      const usage = new Usage([]);
      await usage.init();

      expect(usage.getModule('dep4', 'default')).toBeUndefined();
    });

    it('with non loaded', async () => {
      const usage = new Usage(['dep1']);
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce(
        null,
      );

      await usage.init();

      expect(usage.getModule('dep1', 'default')).toBeUndefined();
    });
  });

  describe('has package', () => {
    it('finds a package', () => {
      const usage = new Usage(['dep2']);

      expect(usage.hasPackage('dep2')).toBe(true);
    });

    it('does not find a package', () => {
      const usage = new Usage([]);

      expect(usage.hasPackage('dep4')).toBe(false);
    });
  });

  describe('has module', () => {
    it('finds a default module', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      const usage = new Usage(['dep2']);
      await usage.init();

      expect(usage.hasModule('dep2', 'default')).toBe(true);
    });

    it('finds a named module', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'methodA',
      ]);
      const usage = new Usage(['dep2']);
      await usage.init();

      expect(usage.hasModule('dep2', 'methodA')).toBe(true);
    });

    it('does not find a package', () => {
      const usage = new Usage([]);

      expect(usage.hasModule('dep4', 'methodA')).toBe(false);
    });

    it('does not find a module', () => {
      const usage = new Usage([]);

      expect(usage.hasModule('dep2', 'methodB')).toBe(false);
    });

    it('with non loaded', async () => {
      const usage = new Usage(['dep1']);
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce(
        null,
      );
      await usage.init();

      expect(usage.hasModule('dep1', 'default')).toBe(false);
    });
  });

  describe('add imports', () => {
    it('with a default module', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      const usage = new Usage(['dep1']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(true);
    });

    it('with a named module', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'methodA',
      ]);
      const usage = new Usage(['dep3']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep3')).toBe(true);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(true);
    });

    it('with default and named modules', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
        'methodA',
      ]);
      const usage = new Usage(['dep2']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep2')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'methodA')).toBe(true);
    });

    it('with no modules', () => {
      const usage = new Usage(['dep1']);
      const imports = [
        {
          moduleSpecifier: 'dep1',
          packageName: 'dep1',
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep1')).toBe(false);

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
    });

    it('with non existent module', () => {
      const usage = new Usage([]);
      const imports = [
        {
          moduleSpecifier: 'dep4',
          packageName: 'dep4',
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep4')).toBe(false);

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep4')).toBe(false);
    });

    it('with null imports module', () => {
      const usage = new Usage([]);
      const imports = [
        {
          moduleSpecifier: 'dep',
          packageName: null,
          moduleNames: [],
        },
      ];

      expect(usage.isPackageUsed('dep')).toBe(false);

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep')).toBe(false);
    });

    it('with multiple imports', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>)
        .mockResolvedValueOnce(['default'])
        .mockResolvedValueOnce(['methodA']);
      const usage = new Usage(['dep2', 'dep3']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep2')).toBe(true);
      expect(usage.isPackageUsed('dep3')).toBe(true);
      expect(usage.isModuleUsed('dep2', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep3', 'methodA')).toBe(true);
    });

    it('with a non tracked package', () => {
      const usage = new Usage([]);
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

      usage.addImports(imports);

      expect(usage.hasPackage('dep4')).toBe(false);
      expect(usage.hasModule('dep4', 'default')).toBe(false);
    });

    it('with a non tracked module', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      const usage = new Usage(['dep1']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.hasModule('dep1', 'methodA')).toBe(false);
    });

    it('with tracked and non tracked packages', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      const usage = new Usage(['dep1']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isPackageUsed('dep4')).toBe(false);
    });

    it('with tracked and non tracked modules', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce([
        'default',
      ]);
      const usage = new Usage(['dep1']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'methodA')).toBe(false);
    });

    it('with non loaded modules', async () => {
      (getPackageModules as jest.MockedFunction<typeof getPackageModules>).mockResolvedValueOnce(
        null,
      );
      const usage = new Usage(['dep1']);
      await usage.init();
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

      usage.addImports(imports);

      expect(usage.isPackageUsed('dep1')).toBe(true);
      expect(usage.isModuleUsed('dep1', 'default')).toBe(false);
    });
  });

  it('prints the report', async () => {
    (getPackageModules as jest.MockedFunction<typeof getPackageModules>)
      .mockResolvedValueOnce(['default', 'methodA'])
      .mockResolvedValueOnce(['default']);
    const spy = jest.spyOn(log, 'info').mockImplementation();
    const usage = new Usage(['dep1', 'dep2']);
    await usage.init();

    const imports = [
      {
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
        defaultName: 'dep1',
        moduleNames: ['default'],
      },
    ];

    usage.addImports(imports);

    usage.print();

    expect(spy).toHaveBeenNthCalledWith(1, 'Usage Report\n');

    spy.mockRestore();
  });
});
