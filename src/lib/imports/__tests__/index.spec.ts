import * as imports from '../index.js';
import parseImports from '../parse-imports.js';

describe('packages', () => {
  it('find missing packages', () => {
    expect(imports.parseImports).toStrictEqual(parseImports);
  });
});
