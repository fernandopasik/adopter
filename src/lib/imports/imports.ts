import type { Mutable, ReadonlyDeep } from 'type-fest';
import { addPackageImport } from '../packages/index.js';

export interface Import {
  defaultName?: string;
  filePath: string;
  moduleNames: string[];
  moduleSpecifier: string;
  named?: Record<string, string>;
  packageName: string | null;
}

export const imports = new Map<string, Import>();

export const importKey = (imprt: ReadonlyDeep<Import>): string =>
  `${imprt.filePath}**${imprt.moduleSpecifier}**${imprt.moduleNames.join('**')}`;

export const addImport = (imprt: ReadonlyDeep<Import>): void => {
  imports.set(importKey(imprt), imprt as Mutable<Import>);
  addPackageImport(imprt);
};

export const getImport = (key: string): Import | undefined => imports.get(key);
