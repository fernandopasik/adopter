import { beforeEach, describe, it, jest } from '@jest/globals';
import assert from 'node:assert/strict';
import { createSourceFile, ScriptTarget } from 'typescript';
import { addImport } from './imports.ts';
import parseImports from './parse-imports.ts';

jest.mock('./imports.ts');
jest.mock('../packages/resolve-package.ts', () => jest.fn((specifier: string) => specifier));

describe('parse imports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('with default imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2";',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'] });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['default'] });
  });

  it('with default and named imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA, moduleB } from "dep2";',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'] });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['moduleA', 'moduleB'] });
  });

  it('with unnamed, default and named imports with alias', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA, moduleB as aliasB } from "dep2"; import "dep5"',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 3);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'] });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['moduleA', 'moduleB'] });
    assert.partialDeepStrictEqual(imports[1], { named: { moduleA: 'moduleA', moduleB: 'aliasB' } });
    assert.partialDeepStrictEqual(imports[2], { moduleNames: [] });
  });

  it('with imports and non imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import { moduleA } from "dep2"; console.log(true)',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'] });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['moduleA'] });
  });

  it('with module imports and type imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import type { Dep2 } from "dep2"; console.log(true)',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'] });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['Dep2'] });
  });

  it('with relative imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "./dep2/example.ts"',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'], packageName: 'dep1' });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['default'], packageName: null });
  });

  it('with internal files in package imports', () => {
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2/example.ts"',
      ScriptTarget.Latest,
    );

    const imports = parseImports(source, filePath);

    assert.strictEqual(imports.length, 2);
    assert.partialDeepStrictEqual(imports[0], { moduleNames: ['default'], packageName: 'dep1' });
    assert.partialDeepStrictEqual(imports[1], { moduleNames: ['default'], packageName: 'dep2' });
  });

  it('stores each import', () => {
    const addImportMock = jest.mocked(addImport);
    const filePath = 'example.ts';
    const source = createSourceFile(
      filePath,
      'import dep1 from "dep1"; import dep2 from "dep2";',
      ScriptTarget.Latest,
    );

    parseImports(source, filePath);

    assert.strictEqual(addImportMock.mock.calls.length, 2);
  });
});
