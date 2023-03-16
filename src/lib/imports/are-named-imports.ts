import ts from 'typescript';

export const areNamedImports = (
  namedBindings?: ts.NamedImportBindings,
): namedBindings is ts.NamedImports =>
  typeof namedBindings !== 'undefined' && ts.isNamedImports(namedBindings);

export default areNamedImports;
