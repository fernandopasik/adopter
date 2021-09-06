import execa from 'execa';

const installPackages = async (packages: readonly string[] = []): Promise<void> => {
  if (packages.length > 0) {
    await execa('npm', ['install', '--silent', '--no-save', '--no-package-lock', ...packages], {
      shell: true,
    });
  }
};

export default installPackages;
