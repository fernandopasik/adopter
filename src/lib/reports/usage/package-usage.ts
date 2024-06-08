import {
  getPackage,
  isModuleImported,
  isPackageImported,
  type Package,
} from '../../packages/index.js';
import isPackageUsed from './is-package-used.js';

export interface PackageUsed {
  isImported: boolean;
  isUsed: boolean;
  name: string;
}

export interface PackageUsage extends PackageUsed {
  dependencies: PackageUsed[];
  dependents: PackageUsed[];
  modulesImported: string[];
  modulesNotImported: string[];
}

const listPackages = (pkgs: Set<Package>): PackageUsed[] =>
  Array.from(pkgs).map(({ name }: { name: string }) => ({
    isImported: isPackageImported(name),
    isUsed: isPackageUsed(name),
    name,
  }));

const filterUsedModules = (modules: Set<string>, packageName: string, isUsed = true): string[] =>
  Array.from(modules).filter((moduleName) => isModuleImported(moduleName, packageName) === isUsed);

const packageUsage = (name: string): PackageUsage => {
  const {
    dependents = new Set<Package>(),
    dependencies = new Set<Package>(),
    modules = new Set<string>(),
  } = getPackage(name) ?? {};

  return {
    dependencies: listPackages(dependencies),
    dependents: listPackages(dependents),
    isImported: isPackageImported(name),
    isUsed: isPackageUsed(name),
    modulesImported: filterUsedModules(modules, name),
    modulesNotImported: filterUsedModules(modules, name, false),
    name,
  };
};

export default packageUsage;
