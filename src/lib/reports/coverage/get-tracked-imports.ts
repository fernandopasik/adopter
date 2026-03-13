import type { Import } from '../../imports/index.ts';
import { isModuleImported, isPackageImported } from '../../packages/index.ts';

export interface TrackedImport {
  packageName: string;
  moduleNames: string[];
}

const filterTrackedImports = (imports: Import[]): Import[] =>
  imports.filter((imprt) => imprt.packageName !== null && isPackageImported(imprt.packageName));

const getTrackedImports = (imports: Import[] = []): TrackedImport[] =>
  filterTrackedImports(imports).map(({ packageName, moduleNames }: Import) => ({
    moduleNames: moduleNames.filter(
      (moduleName) => packageName !== null && isModuleImported(moduleName, packageName),
    ),
    packageName,
  })) as TrackedImport[];

export default getTrackedImports;
