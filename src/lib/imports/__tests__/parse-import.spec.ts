import { describe, expect, it, jest } from '@jest/globals';
import ts from 'typescript';
import parseImport from '../parse-import.js';

jest.mock('../../packages/resolve-package.js', () => jest.fn((specifier: string) => specifier));

describe('parse import', () => {
  it('without default nor named imports', () => {
    const filePath = 'example.ts';
    const {
      statements: [statement],
    } = ts.createSourceFile(filePath, 'import "./dep.ts"', ts.ScriptTarget.Latest);

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: undefined,
      moduleNames: [],
    });
  });

  it('with only default import', () => {
    const filePath = 'example.ts';
    const {
      statements: [statement],
    } = ts.createSourceFile(filePath, 'import dep from "./dep.ts"', ts.ScriptTarget.Latest);

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: 'dep',
      named: undefined,
      moduleNames: ['default'],
    });
  });

  it('with only named import', () => {
    const filePath = 'example.ts';
    const {
      statements: [statement],
    } = ts.createSourceFile(filePath, 'import { dep } from "./dep.ts"', ts.ScriptTarget.Latest);

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: { dep: 'dep' },
      moduleNames: ['dep'],
    });
  });

  it('with multiple named imports', () => {
    const filePath = 'example.ts';
    const {
      statements: [statement],
    } = ts.createSourceFile(
      filePath,
      'import { dep1, dep2 } from "./dep.ts"',
      ts.ScriptTarget.Latest,
    );

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: { dep1: 'dep1', dep2: 'dep2' },
      moduleNames: ['dep1', 'dep2'],
    });
  });

  it('with named imports with alias', () => {
    const filePath = 'example.js';
    const {
      statements: [statement],
    } = ts.createSourceFile(
      filePath,
      'import { dep1 as dep3, dep2 } from "./dep.ts"',
      ts.ScriptTarget.Latest,
    );

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: { dep1: 'dep3', dep2: 'dep2' },
      moduleNames: ['dep1', 'dep2'],
    });
  });

  it('with default and named imports', () => {
    const filePath = 'example.js';
    const {
      statements: [statement],
    } = ts.createSourceFile(
      filePath,
      'import dep, { dep1, dep2 } from "./dep.ts"',
      ts.ScriptTarget.Latest,
    );

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: 'dep',
      named: { dep1: 'dep1', dep2: 'dep2' },
      moduleNames: ['default', 'dep1', 'dep2'],
    });
  });

  it('with default and named imports with alias', () => {
    const filePath = 'example.js';
    const {
      statements: [statement],
    } = ts.createSourceFile(
      filePath,
      'import dep, { dep1, dep2 as dep3 } from "./dep.ts"',
      ts.ScriptTarget.Latest,
    );

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: 'dep',
      named: { dep1: 'dep1', dep2: 'dep3' },
      moduleNames: ['default', 'dep1', 'dep2'],
    });
  });

  it('with a type import', () => {
    const filePath = 'example.js';
    const {
      statements: [statement],
    } = ts.createSourceFile(
      filePath,
      'import type { Dep } from "./dep.ts"',
      ts.ScriptTarget.Latest,
    );

    expect(parseImport(statement as ts.ImportDeclaration, filePath)).toStrictEqual({
      filePath,
      moduleSpecifier: './dep.ts',
      packageName: null,
      defaultName: undefined,
      named: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Dep: 'Dep',
      },
      moduleNames: ['Dep'],
    });
  });
});
