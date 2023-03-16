import type { File } from '../../files/index.js';
import { getFiles } from '../../files/index.js';
import type { TrackedImport } from './get-tracked-imports.js';
import getTrackedImports from './get-tracked-imports.js';
import type { CoverageSummary } from './summary.js';
import summary from './summary.js';

export interface TrackedFile {
  filePath: string;
  trackedImports: TrackedImport[];
}

export interface Coverage {
  summary: CoverageSummary;
  files: TrackedFile[];
}

const coverage = (): Coverage => ({
  summary: summary(),
  files: getFiles().map(({ filePath, imports }: Readonly<File>) => ({
    filePath,
    trackedImports: getTrackedImports(Array.from(imports)),
  })),
});

export default coverage;
