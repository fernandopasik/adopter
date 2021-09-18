import Coverage from '../coverage.js';
import * as reports from '../index.js';
import Usage from '../usage.js';

describe('reports', () => {
  it('usage', () => {
    expect(reports.Usage).toStrictEqual(Usage);
  });

  it('coverage', () => {
    expect(reports.Coverage).toStrictEqual(Coverage);
  });
});
