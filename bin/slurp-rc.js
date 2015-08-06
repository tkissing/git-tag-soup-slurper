#!/usr/bin/env node

var cli = require('../src/cli.js');

var filter = require('../src/filters/rc.js');

cli.run(process.argv, filter);
