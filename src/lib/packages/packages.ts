export interface Package {
  name: string;
  isInstalled: boolean;
  dependants: Set<Package>;
  dependencies: Set<Package>;
  modules: Set<string>;
}

export const packages: Map<string, Package> = new Map();

export const addPackage = (name: string): void => {
  packages.set(name, {
    name,
    isInstalled: false,
    dependants: new Set(),
    dependencies: new Set(),
    modules: new Set(),
  });
};

export const getPackage = (name: string): Package | undefined => packages.get(name);
export const getPackageNames = (): string[] => Array.from(packages.keys());
export const hasModule = (moduleName: string, packageName: string): boolean =>
  Boolean(packages.get(packageName)?.modules.has(moduleName));
export const hasPackage = (name: string): boolean => packages.has(name);

export default packages;
