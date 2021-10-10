import * as imports from '../index.js';
import parseImports from '../parse-imports.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('parse imports', () => {
    expect(imports.parseImports).toStrictEqual(parseImports);
  });
});
