import getPackageModules from './get-package-mods.ts';
import { getPackage } from './packages.ts';

const setPackageMods = async (name: string): Promise<void> => {
  const pkg = getPackage(name);

  if (typeof pkg !== 'undefined') {
    const moduleNames = await getPackageModules(name);

    if (moduleNames !== null && typeof pkg !== 'undefined') {
      pkg.isInstalled = true;

      moduleNames.forEach((moduleName) => {
        pkg.modules.add(moduleName);
      });
    }
  }
};

export default setPackageMods;
