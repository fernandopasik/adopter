import { globbySync } from 'globby';

const listFiles = (globs: readonly string[] = ['**/*.[j|t]s']): string[] =>
  globbySync(globs, { gitignore: true });

export default listFiles;
