import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../../imports/index.js';
import { isModuleImported, isPackageImported } from '../../packages/index.js';

export interface TrackedImport {
  packageName: string;
  moduleNames: string[];
}

const filterTrackedImports = (imports: ReadonlyDeep<Import[]>): Import[] =>
  imports.filter(
    (imprt) => imprt.packageName !== null && isPackageImported(imprt.packageName),
  ) as Import[];

const getTrackedImports = (imports: ReadonlyDeep<Import[]> = []): TrackedImport[] =>
  filterTrackedImports(imports).map(({ packageName, moduleNames }: ReadonlyDeep<Import>) => ({
    packageName,
    moduleNames: moduleNames.filter(
      (moduleName) => packageName !== null && isModuleImported(moduleName, packageName),
    ),
  })) as TrackedImport[];

export default getTrackedImports;
