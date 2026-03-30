import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('list files from globs', async () => {
  const globbySyncMock = mock.fn();
  const sortPathsMock = mock.fn((paths: string[]) => paths);

  const globbyModule = mock.module('globby', {
    namedExports: { globbySync: globbySyncMock },
  });

  const sortPathsModule = mock.module('./sort-paths.ts', {
    defaultExport: sortPathsMock,
  });

  const listFiles = (await import('./list-files.ts')).default;

  beforeEach(() => {
    globbySyncMock.mock.resetCalls();
    sortPathsMock.mock.resetCalls();
  });

  after(() => {
    globbyModule.restore();
    sortPathsModule.restore();
  });

  it('defaults to js and ts files', () => {
    listFiles();

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0)?.arguments, [['**/*.[j|t]s']]);
  });

  it('uses project gitignore', () => {
    listFiles();

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0)?.arguments, [
      { gitignore: true },
    ]);
  });

  it('can search custom globs', () => {
    const globs = ['src/asdf.txt'];
    listFiles(globs);

    assert.strictEqual(globbySyncMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(globbySyncMock.mock.calls.at(0)?.arguments, [globs]);
  });

  it('sorts paths', () => {
    listFiles();

    assert.strictEqual(sortPathsMock.mock.calls.length, 1);
  });
});
