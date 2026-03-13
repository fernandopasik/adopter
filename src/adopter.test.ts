import { describe, expect, it, jest } from '@jest/globals';
import adopter from './adopter.ts';
import run from './lib/run.ts';

jest.mock('./lib/packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('adopter', () => {
  it('export runner', () => {
    expect(adopter).toStrictEqual(run);
  });
});
