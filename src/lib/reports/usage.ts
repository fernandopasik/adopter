import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';
import type { Export, PackageExports } from '../packages/index.js';

interface Module {
  type: string;
  importedFrom: string[];
}

class Usage {
  private readonly storage: Map<string, Map<string, Module>>;

  public constructor(packageExports: Readonly<PackageExports>) {
    this.storage = new Map();

    packageExports.forEach((exports, packageName) => {
      this.storage.set(packageName, new Map<string, Module>());

      exports.forEach(({ name, type }: Readonly<Export>) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.storage.get(packageName)!.set(name, { type, importedFrom: [] });
      });
    });
  }

  public getPackageNames(): string[] {
    return Array.from(this.storage.keys());
  }

  public getPackage(packageName: string): Map<string, Module> | undefined {
    return this.storage.get(packageName);
  }

  public getModule(packageName: string, moduleName: string): Module | undefined {
    return this.storage.get(packageName)?.get(moduleName);
  }

  public hasPackage(packageName: string): boolean {
    return this.storage.has(packageName);
  }

  public hasModule(packageName: string, moduleName: string): boolean {
    return Boolean(this.storage.get(packageName)?.has(moduleName));
  }

  public addImports(filepath: string, imports: ReadonlyDeep<Import[]>): void {
    imports.forEach(({ packageName, moduleNames }) => {
      if (packageName !== null) {
        const pkg = this.storage.get(packageName);

        if (typeof pkg !== 'undefined') {
          moduleNames.forEach((moduleName) => {
            const module = pkg.get(moduleName);

            if (typeof module !== 'undefined') {
              module.importedFrom.push(filepath);
            }
          });
        }
      }
    });
  }
}

export default Usage;
