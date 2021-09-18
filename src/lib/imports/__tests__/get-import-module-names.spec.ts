import getImportModuleNames from '../get-import-module-names.js';

describe('get import module names', () => {
  it('with no modules', () => {
    expect(getImportModuleNames()).toStrictEqual([]);
  });

  it('with only default module', () => {
    expect(getImportModuleNames('dep')).toStrictEqual(['default']);
  });

  it('with only named modules', () => {
    expect(getImportModuleNames(undefined, { dep1: 'dep1', dep2: 'dep2' })).toStrictEqual([
      'dep1',
      'dep2',
    ]);
  });

  it('with default and named modules', () => {
    expect(getImportModuleNames('dep', { dep1: 'dep1', dep2: 'dep2' })).toStrictEqual([
      'default',
      'dep1',
      'dep2',
    ]);
  });
});
