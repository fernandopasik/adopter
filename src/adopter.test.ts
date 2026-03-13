import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import adopter from './adopter.ts';
import run from './lib/run.ts';

jest.mock('./lib/packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('adopter', () => {
  it('export runner', () => {
    assert.strictEqual(adopter, run);
  });
});
