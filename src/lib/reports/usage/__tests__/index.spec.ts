import { describe, expect, it, jest } from '@jest/globals';
import * as usage from '../index.js';
import text from '../text.js';
import json from '../usage.js';

jest.mock('../../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('usage report', () => {
  it('json', () => {
    expect(usage.json).toStrictEqual(json);
  });

  it('text', () => {
    expect(usage.text).toStrictEqual(text);
  });
});
