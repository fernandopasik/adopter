import { addPackageImport } from '../packages/index.js';

export interface Import {
  defaultName?: string | undefined;
  filePath: string;
  moduleNames: string[];
  moduleSpecifier: string;
  named?: Record<string, string> | undefined;
  packageName: string | null;
}

export const imports = new Map<string, Import>();

export const importKey = (imprt: Import): string =>
  `${imprt.filePath}**${imprt.moduleSpecifier}**${imprt.moduleNames.join('**')}`;

export const addImport = (imprt: Import): void => {
  imports.set(importKey(imprt), imprt);
  addPackageImport(imprt);
};

export const getImport = (key: string): Import | undefined => imports.get(key);
