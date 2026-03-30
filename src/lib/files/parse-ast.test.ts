import assert from 'node:assert/strict';
import { after, beforeEach, describe, it, mock } from 'node:test';
import { ScriptTarget, type createSourceFile, type SourceFile } from 'typescript';

describe('parse ast', async () => {
  const createSourceFileMock = mock.fn<typeof createSourceFile>();
  const tsModule = mock.module('typescript', {
    namedExports: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ScriptTarget: { Latest: 99 },
      createSourceFile: createSourceFileMock,
    },
  });

  const parseAst = (await import('./parse-ast.ts')).default;

  beforeEach(() => {
    createSourceFileMock.mock.resetCalls();
  });

  after(() => {
    tsModule.restore();
  });

  it('creates a typescript file', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';

    parseAst(fileName, content);

    assert.strictEqual(createSourceFileMock.mock.calls.length, 1);
    assert.partialDeepStrictEqual(createSourceFileMock.mock.calls.at(0)?.arguments, [
      fileName,
      content,
      ScriptTarget.Latest,
    ]);
  });

  it('returns the ast', () => {
    const fileName = 'example1.ts';
    const content = 'console.log(true)';
    const ast = { fileName };

    createSourceFileMock.mock.mockImplementationOnce(() => ast as SourceFile);

    const result = parseAst(fileName, content);

    assert.strictEqual(createSourceFileMock.mock.calls.length, 1);
    assert.deepStrictEqual(result, ast);
  });

  it('returns undefined when no ts file provided', () => {
    const result = parseAst('example.txt', '');

    assert.strictEqual(result, undefined);
  });
});
