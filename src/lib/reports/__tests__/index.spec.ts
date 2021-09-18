import * as reports from '../index.js';
import Usage from '../usage.js';

describe('reports', () => {
  it('usage', () => {
    expect(reports.Usage).toStrictEqual(Usage);
  });
});
