import { pathToFileURL } from 'url';

// eslint-disable-next-line @typescript-eslint/require-await
const resolvePackage = async (specifier: string): Promise<string> => {
  const cwd = `${process.cwd()}/`;
  const cwdUrl = pathToFileURL(cwd).href;

  return import.meta.resolve(specifier, cwdUrl);
};

export default resolvePackage;
