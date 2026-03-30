import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSourceFile, ScriptTarget, type ImportDeclaration } from 'typescript';
import areNamedImports from './are-named-imports.ts';

describe('are named imports', () => {
  it('with empty', () => {
    assert.strictEqual(areNamedImports(), false);
  });

  it('with only named imports', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import { dep1 } from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    assert.strictEqual(areNamedImports(namedImports), true);
  });

  it('with only default import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import dep from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    assert.strictEqual(areNamedImports(namedImports), false);
  });

  it('with default and named import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import dep, { dep1 } from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    assert.strictEqual(areNamedImports(namedImports), true);
  });

  it('with no default nor named import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    assert.strictEqual(areNamedImports(namedImports), false);
  });
});
