import { pathToFileURL } from 'url';

// eslint-disable-next-line @typescript-eslint/require-await
const resolvePackage = async (specifier: string): Promise<string> => {
  const cwd = `${process.cwd()}/`;
  const cwdUrl = pathToFileURL(cwd).href;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return import.meta.resolve(specifier, cwdUrl);
};

export default resolvePackage;
