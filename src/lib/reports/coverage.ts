import log from 'loglevel';
import { blue, bold } from 'nanocolors';
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

  public print(): void {
    const currentLogLevel = log.getLevel();
    log.setLevel('INFO');

    const filesTracked = Array.from(this.storage.values()).length;
    const filesWithImports = Array.from(this.storage.values()).filter(
      // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
      (file) => file.librariesImports.length > 0,
    ).length;

    log.info(blue(bold('Coverage Report\n')));
    log.info(blue('Files tracked:      '), filesTracked);
    log.info(blue('Files with imports: '), filesWithImports);
    log.info();

    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    this.storage.forEach((file, filePath) => {
      log.info(`${file.librariesImports.length > 0 ? '✅' : '  '} ${filePath}`);
    });

    log.setLevel(currentLogLevel);
  }
}

export default Coverage;
