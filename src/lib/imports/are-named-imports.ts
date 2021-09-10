import type { ReadonlyDeep } from 'type-fest';
import ts from 'typescript';

export const areNamedImports = (
  namedBindings?: ReadonlyDeep<ts.NamedImportBindings>,
): namedBindings is ReadonlyDeep<ts.NamedImports> =>
  typeof namedBindings !== 'undefined' && ts.isNamedImports(namedBindings);

export default areNamedImports;
