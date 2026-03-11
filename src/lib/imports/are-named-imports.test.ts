import { describe, expect, it } from '@jest/globals';
import { createSourceFile, ScriptTarget, type ImportDeclaration } from 'typescript';
import areNamedImports from './are-named-imports.js';

describe('are named imports', () => {
  it('with empty', () => {
    expect(areNamedImports()).toBe(false);
  });

  it('with only named imports', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import { dep1 } from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    expect(areNamedImports(namedImports)).toBe(true);
  });

  it('with only default import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import dep from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    expect(areNamedImports(namedImports)).toBe(false);
  });

  it('with default and named import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import dep, { dep1 } from "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    expect(areNamedImports(namedImports)).toBe(true);
  });

  it('with no default nor named import', () => {
    const {
      statements: [statement],
    } = createSourceFile('example.ts', 'import "./dep.ts"', ScriptTarget.Latest);

    const namedImports = (statement as ImportDeclaration).importClause?.namedBindings;

    expect(areNamedImports(namedImports)).toBe(false);
  });
});
