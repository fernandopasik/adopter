import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import log from 'loglevel';
import print from '../print.js';

jest.mock('loglevel');

describe('print', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sets temporary log level to info', () => {
    const spy1 = jest.spyOn(log, 'getLevel').mockReturnValueOnce(1);
    const spy2 = jest.spyOn(log, 'setLevel');

    print();

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledWith('INFO');
    expect(spy2).toHaveBeenCalledWith(1);

    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('outputs provided text', () => {
    const text = 'My example output.';
    const spy = jest.spyOn(log, 'info');

    print(text);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(text);

    spy.mockRestore();
  });
});
