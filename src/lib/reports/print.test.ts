import { beforeEach, describe, it, jest } from '@jest/globals';
import log from 'loglevel';
import assert from 'node:assert/strict';
import print from './print.ts';

jest.mock('loglevel');

describe('print', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sets temporary log level to info', () => {
    const spy1 = jest.spyOn(log, 'getLevel').mockReturnValueOnce(1);
    const spy2 = jest.spyOn(log, 'setLevel');

    print();

    assert.strictEqual(spy1.mock.calls.length, 1);
    assert.strictEqual(spy2.mock.calls.length, 2);
    assert.partialDeepStrictEqual(spy2.mock.calls.at(0), ['INFO']);
    assert.partialDeepStrictEqual(spy2.mock.calls.at(1), [1]);

    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('outputs provided text', () => {
    const text = 'My example output.';
    const spy = jest.spyOn(log, 'info');

    print(text);

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), [text]);

    spy.mockRestore();
  });
});
