import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import getImportModuleNames from './get-import-module-names.ts';

describe('get import module names', () => {
  it('with no modules', () => {
    assert.deepStrictEqual(getImportModuleNames(), []);
  });

  it('with only default module', () => {
    assert.deepStrictEqual(getImportModuleNames('dep'), ['default']);
  });

  it('with only named modules', () => {
    assert.deepStrictEqual(getImportModuleNames(undefined, { dep1: 'dep1', dep2: 'dep2' }), [
      'dep1',
      'dep2',
    ]);
  });

  it('with default and named modules', () => {
    assert.deepStrictEqual(getImportModuleNames('dep', { dep1: 'dep1', dep2: 'dep2' }), [
      'default',
      'dep1',
      'dep2',
    ]);
  });
});
