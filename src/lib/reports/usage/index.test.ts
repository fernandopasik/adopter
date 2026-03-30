import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as usage from './index.ts';
import text from './text.ts';
import json from './usage.ts';

describe('usage report', () => {
  it('json', () => {
    assert.strictEqual(usage.json, json);
  });

  it('text', () => {
    assert.strictEqual(usage.text, text);
  });
});
