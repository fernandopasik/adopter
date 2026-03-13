#!/usr/bin/env node --experimental-import-meta-resolve

import cli from '../lib/cli.ts';

const COMMANDS_START = 2;
const processArgs = process.argv.slice(COMMANDS_START);

await cli(processArgs);
