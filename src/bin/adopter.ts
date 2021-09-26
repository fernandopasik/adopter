#!/usr/bin/env node --experimental-import-meta-resolve

import cli from '../lib/cli.js';

const COMMANDS_START = 2;
const processArgs = process.argv.slice(COMMANDS_START);

await cli(processArgs);
