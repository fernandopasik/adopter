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
}

export default Coverage;
