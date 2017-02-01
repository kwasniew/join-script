#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var joiner = require('./');
var joined = joiner(argv).toString();
console.log(joined);