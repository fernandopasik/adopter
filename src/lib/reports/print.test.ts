import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';

describe('print', async () => {
  const getLevelMock = mock.fn<() => number>();
  const infoMock = mock.fn();
  const setLevelMock = mock.fn();
  const loglevelMock = mock.module('loglevel', {
    namedExports: {
      getLevel: getLevelMock,
      info: infoMock,
      setLevel: setLevelMock,
    },
  });

  const print = (await import('./print.ts')).default;

  beforeEach(() => {
    getLevelMock.mock.resetCalls();
    infoMock.mock.resetCalls();
    setLevelMock.mock.resetCalls();
  });

  after(() => {
    loglevelMock.restore();
  });

  it('sets temporary log level to info', () => {
    getLevelMock.mock.mockImplementationOnce(() => 1);

    print();

    assert.strictEqual(getLevelMock.mock.calls.length, 1);
    assert.strictEqual(setLevelMock.mock.calls.length, 2);
    assert.deepStrictEqual(setLevelMock.mock.calls.at(0)?.arguments, ['INFO']);
    assert.deepStrictEqual(setLevelMock.mock.calls.at(1)?.arguments, [1]);
  });

  it('outputs provided text', () => {
    const text = 'My example output.';

    print(text);

    assert.strictEqual(infoMock.mock.calls.length, 1);
    assert.deepStrictEqual(infoMock.mock.calls.at(0)?.arguments, [text]);
  });
});
