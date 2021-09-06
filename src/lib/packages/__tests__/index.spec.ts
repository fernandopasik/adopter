import findMissingPackages from '../find-missing-packages.js';
import * as packages from '../index.js';

describe('packages', () => {
  it('has find missing packages', () => {
    expect(packages.findMissingPackages).toStrictEqual(findMissingPackages);
  });
});
