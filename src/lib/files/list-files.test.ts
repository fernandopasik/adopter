import { beforeEach, describe, it, jest } from '@jest/globals';
import { globbySync } from 'globby';
import assert from 'node:assert/strict';
import listFiles from './list-files.ts';
import sortPaths from './sort-paths.ts';

jest.mock('globby', () => ({
  globbySync: jest.fn(() => []),
}));
jest.mock('./sort-paths', () => jest.fn((paths: string[]): string[] => paths));

const globbySyncMock = jest.mocked(globbySync);
const sortPathsMock = jest.mocked(sortPaths);

describe('list files from globs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to js and ts files', () => {
    listFiles();

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0), [['**/*.[j|t]s']]);
  });

  it('uses project gitignore', () => {
    listFiles();

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0), [{ gitignore: true }]);
  });

  it('can search custom globs', () => {
    const globs = ['src/asdf.txt'];
    listFiles(globs);

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0), [globs]);
  });

  it('sorts paths', () => {
    listFiles();

    assert.strictEqual(sortPathsMock.mock.calls.length, 1);
  });
});
