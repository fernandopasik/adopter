/* eslint-disable max-lines */
import log from 'loglevel';
import { bold, dim, green, red } from 'nanocolors';
import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';
import { filterTrackedDependencies, getPackageJson, getPackageModules } from '../packages/index.js';

interface Module {
  isUsed: boolean;
}

interface Package {
  dependencies: Map<string, string>;
  isUsed: boolean;
  modules: Map<string, Module>;
}

interface Summary {
  packagesTracked: number;
  packagesUsed: number;
  packagesUsage: number;
}

interface UsageJsonPackage {
  name: string;
  isUsed: boolean;
  dependencies: {
    name: string;
    isUsed: boolean;
  }[];
  modulesImported: string[];
}

interface UsageJson {
  summary: Summary;
  packages: UsageJsonPackage[];
}

class Usage {
  private readonly storage: Map<string, Package>;

  public constructor(packageNames: readonly string[]) {
    this.storage = new Map();

    packageNames.forEach((packageName) => {
      this.storage.set(packageName, {
        dependencies: new Map(),
        isUsed: false,
        modules: new Map(),
      });
    });
  }

  public async init(): Promise<void> {
    const packageNames = Array.from(this.storage.keys());
    await packageNames.reduce(
      async (prev: Readonly<Promise<void>>, packageName) =>
        prev.then(async () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const pkg = this.storage.get(packageName)!;
          const moduleNames = await getPackageModules(packageName);
          const packageJson = await getPackageJson(packageName);

          if (moduleNames !== null) {
            moduleNames.forEach((moduleName) => {
              pkg.modules.set(moduleName, { isUsed: false });
            });
          }

          if (packageJson !== null) {
            pkg.dependencies = filterTrackedDependencies(packageJson, packageNames);
          }
        }),
      Promise.resolve(),
    );
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

  public isPackageUsed(packageName: string): boolean {
    return Boolean(this.getPackage(packageName)?.isUsed);
  }

  public isModuleUsed(packageName: string, moduleName: string): boolean {
    return Boolean(this.getModule(packageName, moduleName)?.isUsed);
  }

  public setPackageUsed(packageName: string): void {
    const pkg = this.getPackage(packageName);

    if (typeof pkg !== 'undefined') {
      pkg.isUsed = true;
      pkg.dependencies.forEach((_version, dependency) => {
        this.setPackageUsed(dependency);
      });
    }
  }

  public addImports(imports: ReadonlyDeep<Import[]>): void {
    imports.forEach(({ packageName, moduleNames }) => {
      if (packageName !== null) {
        const pkg = this.storage.get(packageName);

        if (typeof pkg !== 'undefined') {
          this.setPackageUsed(packageName);

          moduleNames.forEach((moduleName) => {
            const module = pkg.modules.get(moduleName);

            if (typeof module !== 'undefined') {
              module.isUsed = true;
            }
          });
        }
      }
    });
  }

  public summary(): Summary {
    const packagesTracked = this.getPackageNames().length;
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    const packagesUsed = Array.from(this.storage.values()).filter((pkg) => pkg.isUsed).length;
    const packagesUsage = packagesUsed / packagesTracked;

    return { packagesTracked, packagesUsed, packagesUsage };
  }

  public json(): UsageJson {
    const usage: UsageJson = { summary: this.summary(), packages: [] };

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    this.storage.forEach((pkg, packageName) => {
      usage.packages.push({
        name: packageName,
        isUsed: pkg.isUsed,
        dependencies: Array.from(pkg.dependencies.keys()).map((name) => ({
          name,
          isUsed: this.isPackageUsed(name),
        })),
        modulesImported: Array.from(pkg.modules.entries())
          .filter(([, module]: ReadonlyDeep<[string, Module]>) => module.isUsed)
          .map(([name]: ReadonlyDeep<[string, Module]>) => name),
      });
    });

    return usage;
  }

  // eslint-disable-next-line max-lines-per-function
  public print(): void {
    const currentLogLevel = log.getLevel();
    log.setLevel('INFO');

    const { summary, packages } = this.json();

    log.info('');
    log.info('Package and Modules Usage');
    log.info(dim('--------------------------------------'));
    log.info(dim('Packages Tracked : '), bold(summary.packagesTracked));
    log.info(dim('Packages Used    : '), bold(summary.packagesUsed));
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    log.info(dim('Packages Usage   : '), bold((summary.packagesUsage * 100).toFixed(2)));

    packages.forEach(
      ({ dependencies, isUsed, modulesImported: mods, name }: ReadonlyDeep<UsageJsonPackage>) => {
        log.info('');
        log.info('Package: ', bold(isUsed ? green(name) : red(name)));
        log.info(dim('is Used: '), isUsed ? 'yes' : 'no');
        log.info(
          dim('Dependencies Tracked: '),
          dependencies.map((d) => (d.isUsed ? green(d.name) : red(d.name))).join(', '),
        );
        log.info(dim('Modules Imported: '), mods.length > 0 ? mods.join(', ') : '-');
      },
    );

    log.setLevel(currentLogLevel);
  }
}

export default Usage;
