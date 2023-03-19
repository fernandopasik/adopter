import { globbySync } from 'globby';
import sortPaths from './sort-paths.js';

const listFiles = (globs: string[] = ['**/*.[j|t]s']): string[] =>
  sortPaths(globbySync(globs, { gitignore: true }));

export default listFiles;
