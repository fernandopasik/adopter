import type { Package } from '../../packages/index.js';
import { getPackage, isModuleImported, isPackageImported } from '../../packages/index.js';
import isPackageUsed from './is-package-used.js';

export interface PackageUsed {
  name: string;
  isImported: boolean;
  isUsed: boolean;
}

export interface PackageUsage extends PackageUsed {
  dependants: PackageUsed[];
  dependencies: PackageUsed[];
  modulesImported: string[];
  modulesNotImported: string[];
}

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const listPackages = (pkgs: Set<Package>): PackageUsed[] =>
  Array.from(pkgs).map(({ name }: Readonly<{ name: string }>) => ({
    name,
    isImported: isPackageImported(name),
    isUsed: isPackageUsed(name),
  }));

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
const filterUsedModules = (modules: Set<string>, packageName: string, isUsed = true): string[] =>
  Array.from(modules).filter((moduleName) => isModuleImported(moduleName, packageName) === isUsed);

const packageUsage = (name: string): PackageUsage => {
  const {
    dependants = new Set<Package>(),
    dependencies = new Set<Package>(),
    modules = new Set<string>(),
  } = getPackage(name) ?? {};

  return {
    name,
    isImported: isPackageImported(name),
    isUsed: isPackageUsed(name),
    dependants: listPackages(dependants),
    dependencies: listPackages(dependencies),
    modulesImported: filterUsedModules(modules, name),
    modulesNotImported: filterUsedModules(modules, name, false),
  };
};

export default packageUsage;
