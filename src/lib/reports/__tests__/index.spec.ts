import * as reports from '../index.js';
import print from '../print.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('reports', () => {
  it('print', () => {
    expect(reports.print).toStrictEqual(print);
  });
});
