import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import json from './coverage.ts';
import * as coverage from './index.ts';
import text from './text.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('coverage report', () => {
  it('json', () => {
    assert.strictEqual(coverage.json, json);
  });

  it('text', () => {
    assert.strictEqual(coverage.text, text);
  });
});
