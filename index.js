#!/usr/bin/env node

const handleCLI = require('./handleCLI');
const handleFile = require('./handleFile');

const length = process.argv.length;

if(length == 2) {
    handleCLI();
} else {
    const file = process.argv[2];
    handleFile(file);
}