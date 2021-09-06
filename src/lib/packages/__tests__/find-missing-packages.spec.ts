import findMissingPackages from '../find-missing-packages.js';

describe('find missing packages', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.dontMock('typescript');
  });
  it('with empty list', async () => {
    expect(await findMissingPackages()).toStrictEqual([]);
  });

  it('with an already installed package', async () => {
    jest.doMock('typescript', () => undefined);

    expect(await findMissingPackages(['typescript'])).toStrictEqual([]);
  });

  it('with a non installed package', async () => {
    expect(await findMissingPackages(['typescriptzzz'])).toStrictEqual(['typescriptzzz']);
  });

  it('with installed and non installed packages', async () => {
    jest.doMock('typescript', () => undefined);

    expect(await findMissingPackages(['typescriptzzz', 'typescript'])).toStrictEqual([
      'typescriptzzz',
    ]);
  });
});
