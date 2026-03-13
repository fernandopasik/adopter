import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import analyzePackages from './analyze-packages.ts';
import { addPackage } from './packages.ts';
import setPackageDependencies from './set-package-dependencies.ts';
import setPackageMods from './set-package-mods.ts';

jest.mock('./packages.ts', () => ({ addPackage: jest.fn() }));
jest.mock('./set-package-dependencies.ts');
jest.mock('./set-package-mods.ts');
jest.mock('./resolve-package.ts', () =>
  jest.fn(async (specifier: string) => Promise.resolve(specifier)),
);

describe('analyze packages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds each package', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    expect(addPackage).toHaveBeenCalledTimes(2);
    expect(addPackage).toHaveBeenCalledWith('example1');
    expect(addPackage).toHaveBeenCalledWith('example2');
  });

  it('sets each package modules', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    expect(setPackageMods).toHaveBeenCalledTimes(2);
    expect(setPackageMods).toHaveBeenCalledWith('example1');
    expect(setPackageMods).toHaveBeenCalledWith('example2');
  });

  it('sets each package dependencies', async () => {
    const packageList = ['example1', 'example2'];

    await analyzePackages(packageList);

    expect(setPackageDependencies).toHaveBeenCalledTimes(2);
    expect(setPackageDependencies).toHaveBeenCalledWith('example1');
    expect(setPackageDependencies).toHaveBeenCalledWith('example2');
  });
});
