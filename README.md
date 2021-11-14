# adopter

Auditing tool for tracking packages and modules usage, for increasing adoption of libraries.

<!-- BADGES - START -->

[![Build Status](https://github.com/fernandopasik/adopter/actions/workflows/main.yml/badge.svg)](https://github.com/fernandopasik/adopter/actions/workflows/main.yml 'Build Status')
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

## License

MIT (c) 2021 [Fernando Pasik](https://fernandopasik.com)
