import type { Import } from './parse-import.js';

const getImportModuleNames = (
  defaultName?: Import['defaultName'],
  named: Import['named'] = {},
): string[] => {
  const moduleNames: string[] = [];

  if (typeof defaultName !== 'undefined') {
    moduleNames.push('default');
  }

  moduleNames.push(...Object.keys(named));

  return moduleNames;
};

export default getImportModuleNames;
