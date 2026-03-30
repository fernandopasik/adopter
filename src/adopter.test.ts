import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import adopter from './adopter.ts';
import run from './lib/run.ts';

describe('adopter', () => {
  it('export runner', () => {
    assert.strictEqual(adopter, run);
  });
});
