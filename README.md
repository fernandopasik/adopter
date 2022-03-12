# adopter

Auditing tool for tracking packages and modules usage, for increasing adoption of libraries.

<!-- BADGES - START -->

[![Build Status](https://github.com/fernandopasik/adopter/actions/workflows/main.yml/badge.svg)](https://github.com/fernandopasik/adopter/actions/workflows/main.yml 'Build Status')
[![Coverage Status](https://codecov.io/gh/fernandopasik/adopter/branch/main/graph/badge.svg)](https://codecov.io/gh/fernandopasik/adopter 'Coverage Status')
[![Known Vulnerabilities](https://snyk.io/test/github/fernandopasik/adopter/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fernandopasik/adopter?targetFile=package.json 'Known Vulnerabilities')

[![npm version](https://img.shields.io/npm/v/adopter.svg?logo=npm)](https://www.npmjs.com/package/adopter 'npm version')

<!-- BADGES - END -->

## Install

Install it globally

```sh
npm install -g adopter
```

Install it locally in the project

```sh
npm install adopter
```

## Usage

Can be run as a client

```sh
adopter [options] package1 [package2] [packageN]
```

or in a node script

```js
import adopter from 'adopter';

adopter({ packages: ['package1', 'package2', 'package3'] });
```

### Options

| option           | description                                           | type    | default               |
| ---------------- | ----------------------------------------------------- | ------- | --------------------- |
| --help           | Show help                                             | boolean |                       |
| --version        | Show version number                                   | boolean |                       |
| --coverage       | Report file coverage                                  | boolean | false                 |
| --debug          | Display debugging information                         | boolean | false                 |
| --rootDir        | Root directory containing files for tracking packages | string  | "."                   |
| --srcIgnoreMatch | Glob patterns to ignore files for tracking packages   | array   | []                    |
| --srcMatch       | Glob patterns to match files for tracking packages    | array   | ["\*\*/\*.[jt]s?(x)"] |

## Audit Information

The tool runs on your codebase and displays two types of reports

- Package and module usage
- File imports coverage

### Package and module usage

This section displays a summary with amount of packages tracked, used and it's usage percentage.
Also displays information on each package:

- If package **is imported** in the codebase
- If the package **is indirectly used** by other packages
- What packages in the list are dependencies of the analyzed package
- What packages in the list are dependents of the analyzed package
- Which **modules are imported** in your codebase
- Which **modules are not imported** in your codebase

### File imports coverage

This section displays a summary with the amount of files tracked and amount of files that import tracked packages.
Also displays the list of files in your codebase and if and which packages and modules are imported on each file.

## License

MIT (c) 2021 [Fernando Pasik](https://fernandopasik.com)
