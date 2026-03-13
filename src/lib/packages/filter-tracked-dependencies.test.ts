import { describe, it } from '@jest/globals';
import assert from 'node:assert/strict';
import filterTrackedDependencies from './filter-tracked-dependencies.ts';

describe('filter tracked dependencies', () => {
  const packageJson = {
    dependencies: {
      dep1: '*',
      dep2: '*',
    },
    name: 'dep',
    peerDependencies: {
      dep3: '*',
      dep4: '*',
    },
  };

  it('with empty tracked packages', () => {
    assert.deepStrictEqual(filterTrackedDependencies(packageJson), []);
  });

  it('with all tracked dependencies', () => {
    assert.deepStrictEqual(filterTrackedDependencies(packageJson, ['dep1', 'dep2']), [
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
    ]);
  });

  it('with some tracked dependencies', () => {
    assert.deepStrictEqual(filterTrackedDependencies(packageJson, ['dep2']), [
      { name: 'dep2', version: '*' },
    ]);
  });

  it('with tracked dependencies and peerdependencies', () => {
    assert.deepStrictEqual(
      filterTrackedDependencies(packageJson, ['dep1', 'dep2', 'dep3', 'dep4']),
      [
        { name: 'dep1', version: '*' },
        { name: 'dep2', version: '*' },
        { name: 'dep3', version: '*' },
        { name: 'dep4', version: '*' },
      ],
    );
  });

  it('with some tracked dependencies and peerdependencies', () => {
    assert.deepStrictEqual(filterTrackedDependencies(packageJson, ['dep2', 'dep3']), [
      { name: 'dep2', version: '*' },
      { name: 'dep3', version: '*' },
    ]);
  });

  it('with only tracked peerdependencies', () => {
    assert.deepStrictEqual(filterTrackedDependencies(packageJson, ['dep3']), [
      { name: 'dep3', version: '*' },
    ]);
  });

  it('with no dependencies', () => {
    assert.deepStrictEqual(filterTrackedDependencies({}, []), []);
  });
});
