import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import json from './coverage.ts';
import * as coverage from './index.ts';
import text from './text.ts';

describe('coverage report', () => {
  it('json', () => {
    assert.strictEqual(coverage.json, json);
  });

  it('text', () => {
    assert.strictEqual(coverage.text, text);
  });
});
