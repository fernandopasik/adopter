const extractPackageName = (importPath = ''): string | null => {
  if (importPath === '') {
    return null;
  }

  if (importPath.startsWith('.')) {
    return null;
  }

  const parts = importPath.split('/');

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]!;
};

export default extractPackageName;
