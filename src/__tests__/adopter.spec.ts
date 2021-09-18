import adopter from '../adopter.js';
import run from '../lib/run.js';

jest.mock('globby', () => ({
  globbySync: jest.fn(),
}));

describe('adopter', () => {
  it('export runner', () => {
    expect(adopter).toStrictEqual(run);
  });
});
