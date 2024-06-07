import { getFiles, type File } from '../../files/index.js';
import getTrackedImports, { type TrackedImport } from './get-tracked-imports.js';
import summary, { type CoverageSummary } from './summary.js';

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
  files: getFiles().map(({ filePath, imports }: File) => ({
    filePath,
    trackedImports: getTrackedImports(Array.from(imports)),
  })),
});

export default coverage;
