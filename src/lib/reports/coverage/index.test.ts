import { describe, expect, it, jest } from '@jest/globals';
import json from './coverage.ts';
import * as coverage from './index.ts';
import text from './text.ts';

jest.mock('../../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('coverage report', () => {
  it('json', () => {
    expect(coverage.json).toStrictEqual(json);
  });

  it('text', () => {
    expect(coverage.text).toStrictEqual(text);
  });
});
