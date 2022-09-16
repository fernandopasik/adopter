import type { ReadonlyDeep } from 'type-fest';
import type { Import } from '../imports/index.js';

export interface File {
  filePath: string;
  imports: Set<Import>;
}

export const files = new Map<string, File>();

export const addFile = (filePath: string): void => {
  if (!files.has(filePath)) {
    files.set(filePath, { filePath, imports: new Set() });
  }
};

export const addFileImports = (filePath: string, imprts: ReadonlyDeep<Import[]> = []): void => {
  const file = files.get(filePath);

  if (typeof file !== 'undefined') {
    imprts.forEach((imprt) => {
      file.imports.add(imprt as Import);
    });
  }
};

export const getFile = (filePath: string): File | undefined => files.get(filePath);
export const getFilePaths = (): string[] => Array.from(files.keys());
export const getFiles = (): File[] => Array.from(files.values());
