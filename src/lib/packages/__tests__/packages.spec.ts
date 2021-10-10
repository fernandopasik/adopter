import {
  addPackage,
  getPackage,
  getPackageNames,
  hasModule,
  hasPackage,
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
      dependants: new Set(),
      dependencies: new Set(),
      modules: new Set(),
    });
  });

  it('get package names', () => {
    addPackage('example1');
    addPackage('example2');

    expect(getPackageNames()).toStrictEqual(['example1', 'example2']);
  });
});
