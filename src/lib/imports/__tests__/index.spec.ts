import areNamedImports from '../are-named-imports.js';
import getImportModuleNames from '../get-import-module-names.js';
import * as imports from '../index.js';
import parseImport from '../parse-import.js';
import parseImports from '../parse-imports.js';

describe('packages', () => {
  it('are named imports', () => {
    expect(imports.areNamedImports).toStrictEqual(areNamedImports);
  });

  it('get import module names', () => {
    expect(imports.getImportModuleNames).toStrictEqual(getImportModuleNames);
  });

  it('parse import', () => {
    expect(imports.parseImport).toStrictEqual(parseImport);
  });

  it('parse imports', () => {
    expect(imports.parseImports).toStrictEqual(parseImports);
  });
});
