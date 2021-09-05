import path from 'path';
import ts from 'typescript';

const parseAst = (filename: string, content: string): ts.SourceFile | undefined => {
  const extension = path.extname(filename);

  return /.[jt]sx?/.test(extension)
    ? ts.createSourceFile(filename, content, ts.ScriptTarget.Latest)
    : undefined;
};

export default parseAst;
