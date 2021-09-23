import filterTrackedDependencies from '../filter-tracked-dependencies.js';

describe('filter tracked dependencies', () => {
  const packageJson = {
    name: 'dep',
    dependencies: {
      dep1: '*',
      dep2: '*',
    },
    peerDependencies: {
      dep3: '*',
      dep4: '*',
    },
  };

  it('with empty tracked packages', () => {
    expect(filterTrackedDependencies(packageJson)).toStrictEqual(new Map());
  });

  it('with all tracked dependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep1', 'dep2'])).toStrictEqual(
      new Map([
        ['dep1', '*'],
        ['dep2', '*'],
      ]),
    );
  });

  it('with some tracked dependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep2'])).toStrictEqual(
      new Map([['dep2', '*']]),
    );
  });

  it('with tracked dependencies and peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep1', 'dep2', 'dep3', 'dep4'])).toStrictEqual(
      new Map([
        ['dep1', '*'],
        ['dep2', '*'],
        ['dep3', '*'],
        ['dep4', '*'],
      ]),
    );
  });

  it('with some tracked dependencies and peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep2', 'dep3'])).toStrictEqual(
      new Map([
        ['dep2', '*'],
        ['dep3', '*'],
      ]),
    );
  });

  it('with only tracked peerdependencies', () => {
    expect(filterTrackedDependencies(packageJson, ['dep3'])).toStrictEqual(
      new Map([['dep3', '*']]),
    );
  });

  it('with no dependencies', () => {
    expect(filterTrackedDependencies({}, [])).toStrictEqual(new Map());
  });
});
