import { describe, expect, it, jest } from '@jest/globals';
import * as imports from './index.ts';
import parseImports from './parse-imports.ts';

jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('parse imports', () => {
    expect(imports.parseImports).toStrictEqual(parseImports);
  });
});
