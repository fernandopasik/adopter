import { beforeEach, describe, expect, it } from '@jest/globals';
import {
  addPackage,
  addPackageImport,
  getPackage,
  getPackageNames,
  hasModule,
  hasPackage,
  isModuleImported,
  isPackageImported,
  packages,
} from '../packages.js';

describe('packages', () => {
  beforeEach(() => {
    packages.clear();
  });

  it('can add package', () => {
    addPackage('example');

    expect(packages.has('example')).toBe(true);
  });

  it('does not have a package', () => {
    expect(hasPackage('nonexistent')).toBe(false);
  });

  it('can have a package', () => {
    addPackage('example');

    expect(hasPackage('example')).toBe(true);
  });

  it('does not have a module', () => {
    addPackage('example');

    expect(hasModule('moduleA', 'example')).toBe(false);
    expect(hasModule('moduleA', 'example2')).toBe(false);
  });

  it('can have a module', () => {
    addPackage('example');

    const pkg = getPackage('example');
    pkg?.modules.add('moduleA');

    expect(hasModule('moduleA', 'example')).toBe(true);
  });

  it('get package', () => {
    addPackage('example');

    expect(getPackage('example')).toStrictEqual({
      name: 'example',
      isInstalled: false,
      dependents: new Set(),
      dependencies: new Set(),
      imports: new Set(),
      modules: new Set(),
    });
  });

  it('get package names', () => {
    addPackage('example1');
    addPackage('example2');

    expect(getPackageNames()).toStrictEqual(['example1', 'example2']);
  });

  describe('package imports', () => {
    const imprt = {
      filePath: 'example.ts',
      moduleNames: ['default'],
      moduleSpecifier: 'example1',
      packageName: 'example1',
    };

    it('add package import', () => {
      addPackage('example1');
      expect(getPackage('example1')?.imports.has(imprt)).toBe(false);

      addPackageImport(imprt);
      expect(getPackage('example1')?.imports.has(imprt)).toBe(true);
    });

    it('add non existing package import', () => {
      const imprt2 = {
        filePath: 'example.ts',
        moduleNames: ['default'],
        moduleSpecifier: 'example2',
        packageName: 'example2',
      };

      addPackage('example1');
      expect(getPackage('example1')?.imports.has(imprt2)).toBe(false);

      addPackageImport(imprt2);

      expect(getPackage('example1')?.imports.has(imprt2)).toBe(false);
    });

    describe('is package imported', () => {
      it('with existent and imported package', () => {
        addPackage('example1');
        expect(isPackageImported('example1')).toBe(false);

        addPackageImport(imprt);
        expect(isPackageImported('example1')).toBe(true);
      });

      it('with existent and non imported package', () => {
        addPackage('example1');
        expect(isPackageImported('example1')).toBe(false);
      });

      it('with non existent package', () => {
        expect(isPackageImported('example2')).toBe(false);
      });
    });

    describe('is module imported', () => {
      it('with imported package and module', () => {
        addPackage('example1');
        expect(isModuleImported('default', 'example1')).toBe(false);

        addPackageImport(imprt);
        expect(isModuleImported('default', 'example1')).toBe(true);
      });

      it('with imported package and not module', () => {
        addPackage('example1');
        expect(isModuleImported('module1', 'example1')).toBe(false);

        addPackageImport(imprt);
        expect(isModuleImported('module1', 'example1')).toBe(false);
      });

      it('with non imported package', () => {
        expect(isModuleImported('module1', 'example1')).toBe(false);
      });
    });
  });
});
