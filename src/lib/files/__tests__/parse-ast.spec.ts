import { describe, expect, it, jest } from '@jest/globals';
import ts from 'typescript';
import parseAst from '../parse-ast.js';

jest.mock('typescript', () => ({
  createSourceFile: jest.fn(),
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ScriptTarget: { Latest: 99 },
}));

describe('parse ast', () => {
  it('creates a typescript file', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';

    const spy = jest.spyOn(ts, 'createSourceFile');

    parseAst(fileName, content);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fileName, content, ts.ScriptTarget.Latest);

    spy.mockRestore();
  });

  it('returns the ast', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';
    const ast = { fileName };

    const spy = jest.spyOn(ts, 'createSourceFile').mockReturnValueOnce(ast as ts.SourceFile);

    const result = parseAst(fileName, content);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual(ast);

    spy.mockRestore();
  });

  it('returns undefined when no ts file provided', () => {
    const result = parseAst('example.txt', '');

    expect(result).toBeUndefined();
  });
});
