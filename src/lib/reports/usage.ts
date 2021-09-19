import log from 'loglevel';
import { blue, bold } from 'nanocolors';
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

      if (exports !== null) {
        exports.forEach(({ name, type }: Readonly<Export>) => {
          this.storage.get(packageName)?.modules.set(name, { type, importedFrom: [] });
        });
      }
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

  public print(): void {
    const packageAmount = this.getPackageNames().length;

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    const packagesUsed = Array.from(this.storage.values()).filter((pkg) => pkg.isUsed).length;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const packagesUsage = ((packagesUsed / packageAmount) * 100).toFixed(2);

    log.info(blue(bold('Usage Report\n')));
    log.info(blue('Packages tracked: '), packageAmount);
    log.info(blue('Packages used:    '), packagesUsed);
    log.info(blue('Packages usage:   '), `${packagesUsage}%`);
    log.info('');

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    this.storage.forEach((pkg, packageName) => {
      log.info(`${pkg.isUsed ? '✅' : '❌'} ${packageName}\n`);
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      pkg.modules.forEach((module, moduleName) => {
        log.info(`  ${module.importedFrom.length > 0 ? '✅' : '  '} ${moduleName}`);
      });
      log.info();
    });
  }
}

export default Usage;
