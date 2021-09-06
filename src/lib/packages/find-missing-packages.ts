interface ImportError {
  code: string;
  message: string;
}

const findMissingPackages = async (packages: readonly string[] = []): Promise<string[]> =>
  (await Promise.allSettled(packages.map(async (packageName: string) => import(packageName))))
    .filter(
      (result) =>
        result.status === 'rejected' &&
        (result.reason as ImportError).code.includes('MODULE_NOT_FOUND'),
    )
    .map((_, index) => packages[index]);

export default findMissingPackages;
