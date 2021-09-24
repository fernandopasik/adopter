import Coverage from '../coverage.js';
import * as reports from '../index.js';
import Usage from '../usage.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('reports', () => {
  it('usage', () => {
    expect(reports.Usage).toStrictEqual(Usage);
  });

  it('coverage', () => {
    expect(reports.Coverage).toStrictEqual(Coverage);
  });
});
