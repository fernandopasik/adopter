import { getFiles, type File } from '../../files/index.ts';
import getTrackedImports, { type TrackedImport } from './get-tracked-imports.ts';
import summary, { type CoverageSummary } from './summary.ts';

export interface TrackedFile {
  filePath: string;
  trackedImports: TrackedImport[];
}

export interface Coverage {
  summary: CoverageSummary;
  files: TrackedFile[];
}

const coverage = (): Coverage => ({
  files: getFiles().map(({ filePath, imports }: File) => ({
    filePath,
    trackedImports: getTrackedImports(Array.from(imports)),
  })),
  summary: summary(),
});

export default coverage;
