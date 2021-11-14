import json from '../coverage.js';
import * as coverage from '../index.js';
import text from '../text.js';

jest.mock('../../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('coverage report', () => {
  it('json', () => {
    expect(coverage.json).toStrictEqual(json);
  });

  it('text', () => {
    expect(coverage.text).toStrictEqual(text);
  });
});
