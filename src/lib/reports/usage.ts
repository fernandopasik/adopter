/* eslint-disable max-lines */
import chalk from 'chalk';
import log from 'loglevel';
import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';
import { filterTrackedDependencies, getPackageJson, getPackageModules } from '../packages/index.js';

interface Module {
  isUsed: boolean;
}

interface Package {
  name: string;
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
  modulesNotImported: string[];
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
        name: packageName,
        dependencies: new Map(),
        isUsed: false,
        modules: new Map(),
      });
    });
  }

  // eslint-disable-next-line max-lines-per-function
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
            const filteredDependencies = filterTrackedDependencies(packageJson, packageNames).map(
              ({
                name,
                version,
              }: Readonly<{ name: string; version: string }>): [string, string] => [name, version],
            );
            pkg.dependencies = new Map(filteredDependencies);
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
        modulesNotImported: Array.from(pkg.modules.entries())
          .filter(([, module]: ReadonlyDeep<[string, Module]>) => !module.isUsed)
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
    log.info(chalk.dim('--------------------------------------'));
    log.info(chalk.dim('Packages Tracked : '), chalk.bold(summary.packagesTracked));
    log.info(chalk.dim('Packages Used    : '), chalk.bold(summary.packagesUsed));
    log.info(
      chalk.dim('Packages Usage   : '),
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      chalk.bold((summary.packagesUsage * 100).toFixed(2)),
    );

    // eslint-disable-next-line max-lines-per-function
    packages.forEach((pkg: ReadonlyDeep<UsageJsonPackage>) => {
      log.info('');
      log.info(
        'Package              : ',
        chalk.bold(pkg.isUsed ? chalk.green(pkg.name) : chalk.red(pkg.name)),
      );
      log.info(chalk.dim('is Used              : '), pkg.isUsed ? 'yes' : 'no');
      log.info(
        chalk.dim('Dependencies Tracked : '),
        pkg.dependencies.length > 0
          ? pkg.dependencies
              .map((d) => (d.isUsed ? chalk.green(d.name) : chalk.red(d.name)))
              .join(', ')
          : '-',
      );
      log.info(
        chalk.dim('Modules Imported     : '),
        pkg.modulesImported.length > 0 ? pkg.modulesImported.join(', ') : '-',
      );
      log.info(
        chalk.dim('Modules not Imported : '),
        pkg.modulesNotImported.length > 0 ? pkg.modulesNotImported.join(', ') : '-',
      );
    });

    log.setLevel(currentLogLevel);
  }
}

export default Usage;
