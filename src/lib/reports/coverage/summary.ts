import { getFile, getFilePaths } from '../../files/index.ts';

export interface CoverageSummary {
  filesTracked: number;
  filesWithImports: number;
}

const summary = (): CoverageSummary => {
  const filepaths = getFilePaths();
  const { length: filesTracked } = filepaths;
  const { length: filesWithImports } = filepaths.filter((filepath: string) =>
    Boolean(getFile(filepath)?.imports.size),
  );

  return { filesTracked, filesWithImports };
};

export default summary;
