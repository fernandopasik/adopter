const sortPaths = (paths: string[] = []): string[] =>
  [...paths].sort((path1: string, path2: string): number => {
    const folder1 = path1.substring(0, path1.lastIndexOf('/'));
    const folder2 = path2.substring(0, path2.lastIndexOf('/'));

    if (folder1 === folder2) {
      return path1.localeCompare(path2);
    }

    return folder1.localeCompare(folder2);
  });

export default sortPaths;
