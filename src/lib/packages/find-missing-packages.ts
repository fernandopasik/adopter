interface ImportError {
  code: string;
  message: string;
}

interface ImportItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: PromiseSettledResult<any>;
  packageName: string;
}

const findMissingPackages = async (packages: readonly string[] = []): Promise<string[]> =>
  (await Promise.allSettled(packages.map(async (packageName: string) => import(packageName))))
    .map((result, index) => ({ packageName: packages[index], result }))
    .filter(
      ({ result }: Readonly<ImportItem>) =>
        result.status === 'rejected' &&
        (result.reason as ImportError).code.includes('MODULE_NOT_FOUND'),
    )
    .map(({ packageName }: Readonly<ImportItem>) => packageName);

export default findMissingPackages;
