import { describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import ts, { ScriptTarget, type SourceFile } from 'typescript';
import parseAst from './parse-ast.ts';

jest.mock('typescript', () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ScriptTarget: { Latest: 99 },
  createSourceFile: jest.fn(),
}));

describe('parse ast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a typescript file', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';

    const spy = jest.spyOn(ts, 'createSourceFile');

    parseAst(fileName, content);

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.partialDeepStrictEqual(spy.mock.calls.at(0), [fileName, content, ScriptTarget.Latest]);

    spy.mockRestore();
  });

  it('returns the ast', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';
    const ast = { fileName };

    const spy = jest.spyOn(ts, 'createSourceFile').mockReturnValueOnce(ast as SourceFile);

    const result = parseAst(fileName, content);

    assert.strictEqual(spy.mock.calls.length, 1);
    assert.deepStrictEqual(result, ast);

    spy.mockRestore();
  });

  it('returns undefined when no ts file provided', () => {
    const result = parseAst('example.txt', '');

    assert.strictEqual(result, undefined);
  });
});
