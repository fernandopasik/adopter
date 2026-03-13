import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import * as imports from './index.ts';
import parseImports from './parse-imports.ts';

jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('packages', () => {
  it('parse imports', () => {
    assert.strictEqual(imports.parseImports, parseImports);
  });
});
