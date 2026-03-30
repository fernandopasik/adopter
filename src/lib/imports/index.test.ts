import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as imports from './index.ts';
import parseImports from './parse-imports.ts';

describe('packages', () => {
  it('parse imports', () => {
    assert.strictEqual(imports.parseImports, parseImports);
  });
});
