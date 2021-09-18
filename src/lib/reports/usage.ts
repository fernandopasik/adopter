import log from 'loglevel';
import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';
import type { Export, PackageExports } from '../packages/index.js';

interface Module {
  type: string;
  importedFrom: string[];
}

interface Package {
  isUsed: boolean;
  modules: Map<string, Module>;
}

log.setDefaultLevel('INFO');

class Usage {
  private readonly storage: Map<string, Package>;

  public constructor(packageExports: Readonly<PackageExports>) {
    this.storage = new Map();

    packageExports.forEach((exports, packageName) => {
      this.storage.set(packageName, { isUsed: false, modules: new Map<string, Module>() });

      exports.forEach(({ name, type }: Readonly<Export>) => {
        this.storage.get(packageName)?.modules.set(name, { type, importedFrom: [] });
      });
    });
  }

  public getPackageNames(): string[] {
    return Array.from(this.storage.keys());
  }

  public getPackage(packageName: string): Package | undefined {
    return this.storage.get(packageName);
  }

  public getModule(packageName: string, moduleName: string): Module | undefined {
    return this.storage.get(packageName)?.modules.get(moduleName);
  }

  public hasPackage(packageName: string): boolean {
    return this.storage.has(packageName);
  }

  public hasModule(packageName: string, moduleName: string): boolean {
    return Boolean(this.storage.get(packageName)?.modules.has(moduleName));
  }

  public addImports(filepath: string, imports: ReadonlyDeep<Import[]>): void {
    imports.forEach(({ packageName, moduleNames }) => {
      if (packageName !== null) {
        const pkg = this.storage.get(packageName);

        if (typeof pkg !== 'undefined') {
          moduleNames.forEach((moduleName) => {
            const module = pkg.modules.get(moduleName);

            if (typeof module !== 'undefined') {
              pkg.isUsed = true;
              module.importedFrom.push(filepath);
            }
          });
        }
      }
    });
  }
}

export default Usage;
