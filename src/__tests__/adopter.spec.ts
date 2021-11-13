import adopter from '../adopter.js';
import run from '../lib/run.js';

jest.mock('../lib/packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('adopter', () => {
  it('export runner', () => {
    expect(adopter).toStrictEqual(run);
  });
});
