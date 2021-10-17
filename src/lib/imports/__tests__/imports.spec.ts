import { addImport, getImport, importKey, imports } from '../imports.js';

describe('imports', () => {
  beforeEach(() => {
    imports.clear();
  });

  describe('key', () => {
    it('with default module in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      expect(importKey(imprt)).toBe('example.js**dep1**default');
    });

    it('with named modules in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['methodA', 'methodB'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      expect(importKey(imprt)).toBe('example.js**dep1**methodA**methodB');
    });

    it('with default and  modules in package', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default', 'methodA', 'methodB'],
        moduleSpecifier: 'dep1',
        packageName: 'dep1',
      };

      expect(importKey(imprt)).toBe('example.js**dep1**default**methodA**methodB');
    });

    it('with a relative import', () => {
      const imprt = {
        filePath: 'example.js',
        moduleNames: ['default'],
        moduleSpecifier: './src/example.ts',
        packageName: null,
      };

      expect(importKey(imprt)).toBe('example.js**./src/example.ts**default');
    });
  });

  it('can add an import', () => {
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    expect(imports.get('example.js**dep1**default')).toStrictEqual(imprt);
  });

  it('can get an existing import', () => {
    const imprt = {
      filePath: 'example.js',
      moduleNames: ['default'],
      moduleSpecifier: 'dep1',
      packageName: 'dep1',
    };

    addImport(imprt);

    expect(getImport('example.js**dep1**default')).toStrictEqual(imprt);
  });

  it('can not get a non xisting import', () => {
    expect(getImport('dep1**default')).toBeUndefined();
  });
});
