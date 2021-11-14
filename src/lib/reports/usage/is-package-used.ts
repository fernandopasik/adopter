import { getPackage, isPackageImported } from '../../packages/index.js';

const isPackageUsed = (packageName: string): boolean => {
  if (isPackageImported(packageName)) {
    return true;
  }

  const pkg = getPackage(packageName);

  if (typeof pkg === 'undefined') {
    return false;
  }

  return Boolean(
    Array.from(pkg.dependents).find(({ name }: Readonly<{ name: string }>) => isPackageUsed(name)),
  );
};

export default isPackageUsed;
