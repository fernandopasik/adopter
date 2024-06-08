import { describe, expect, it } from '@jest/globals';
import filterTrackedDependencies from '../filter-tracked-dependencies.js';

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
    expect(filterTrackedDependencies(packageJson)).toStrictEqual([]);
  });

  it('with all tracked dependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep1', 'dep2'])).toStrictEqual([
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
    ]);
  });

  it('with some tracked dependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep2'])).toStrictEqual([
      { name: 'dep2', version: '*' },
    ]);
  });

  it('with tracked dependencies and peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep1', 'dep2', 'dep3', 'dep4'])).toStrictEqual([
      { name: 'dep1', version: '*' },
      { name: 'dep2', version: '*' },
      { name: 'dep3', version: '*' },
      { name: 'dep4', version: '*' },
    ]);
  });

  it('with some tracked dependencies and peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep2', 'dep3'])).toStrictEqual([
      { name: 'dep2', version: '*' },
      { name: 'dep3', version: '*' },
    ]);
  });

  it('with only tracked peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep3'])).toStrictEqual([
      { name: 'dep3', version: '*' },
    ]);
  });

  it('with no dependencies', () => {
    expect(filterTrackedDependencies({}, [])).toStrictEqual([]);
  });
});
