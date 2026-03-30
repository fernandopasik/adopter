import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import * as coverage from './coverage/index.ts';
import * as reports from './index.ts';
import print from './print.ts';
import * as usage from './usage/index.ts';

describe('reports', () => {
  it('coverage', () => {
    assert.strictEqual(reports.coverage, coverage);
  });

  it('print', () => {
    assert.strictEqual(reports.print, print);
  });

  it('usage', () => {
    assert.strictEqual(reports.usage, usage);
  });
});
