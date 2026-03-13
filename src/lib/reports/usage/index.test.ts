import { describe, expect, it, jest } from '@jest/globals';
import * as usage from './index.ts';
import text from './text.ts';
import json from './usage.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('usage report', () => {
  it('json', () => {
    expect(usage.json).toStrictEqual(json);
  });

  it('text', () => {
    expect(usage.text).toStrictEqual(text);
  });
});
