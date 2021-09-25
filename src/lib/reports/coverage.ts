import chalk from 'chalk';
import log from 'loglevel';
import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';
import type Usage from './usage.js';

interface ModuleImport {
  packageName: string;
  moduleName: string;
}

export interface ImportAnalysis {
  all: ReadonlyDeep<Import[]>;
  librariesImports: ReadonlyDeep<ModuleImport[]>;
}

interface Summary {
  filesTracked: number;
  filesWithImports: number;
}

class Coverage {
  private readonly storage: Map<string, ImportAnalysis>;

  private readonly usage: ReadonlyDeep<Usage>;

  public constructor(usage: ReadonlyDeep<Usage>) {
    this.storage = new Map();
    this.usage = usage;
  }

  public addFile(filepath: string, imports: ReadonlyDeep<Import[]>): void {
    const librariesImports: ModuleImport[] = [];

    imports.forEach(({ packageName, moduleNames }) => {
      if (packageName !== null) {
        moduleNames.forEach((moduleName) => {
          if (this.usage.hasModule(packageName, moduleName)) {
            librariesImports.push({ packageName, moduleName });
          }
        });
      }
    });

    this.storage.set(filepath, {
      all: imports,
      librariesImports,
    });
  }

  public getFile(filepath: string): ImportAnalysis | undefined {
    return this.storage.get(filepath);
  }

  public summary(): Summary {
    const filesTracked = Array.from(this.storage.values()).length;
    const filesWithImports = Array.from(this.storage.values()).filter(
      (file: ReadonlyDeep<ImportAnalysis>) => file.librariesImports.length > 0,
    ).length;

    return { filesTracked, filesWithImports };
  }

  public print(): void {
    const currentLogLevel = log.getLevel();
    log.setLevel('INFO');

    const summary = this.summary();

    log.info('');
    log.info('Imported Packages and Modules Coverage');
    log.info(chalk.dim('--------------------------------------'));
    log.info(chalk.dim('Files Tracked      : '), chalk.bold(summary.filesTracked));
    log.info(chalk.dim('Files with Imports : '), chalk.bold(summary.filesWithImports));

    log.info();

    this.storage.forEach((file: ReadonlyDeep<ImportAnalysis>, filePath) => {
      log.info(
        file.librariesImports.length > 0 ? chalk.bold(chalk.green(filePath)) : chalk.dim(filePath),
      );

      file.librariesImports.forEach((imprt) => {
        log.info(chalk.dim(' └'), chalk.blue(imprt.packageName), '/', chalk.cyan(imprt.moduleName));
      });
    });

    log.setLevel(currentLogLevel);
  }
}

export default Coverage;
