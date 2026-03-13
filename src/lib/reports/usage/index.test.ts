import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import * as usage from './index.ts';
import text from './text.ts';
import json from './usage.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('usage report', () => {
  it('json', () => {
    assert.strictEqual(usage.json, json);
  });

  it('text', () => {
    assert.strictEqual(usage.text, text);
  });
});
