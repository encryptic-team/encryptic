var assert = require('assert');
const tempy = require('tempy');
const fs = require('fs-extra');
const path = require('path');

import Config from '../../src/components/config';
import Filesystem from '../../src/components/storage/filesystem';

var OUTDIR = tempy.directory();
var OUTFILE = "filesystem-test-file";
var OUTPATH = path.join(OUTDIR, `${OUTFILE}.json`);
var CONFFILE = tempy.file({extension: 'conf'});

var testConfig = new Config(CONFFILE);
var testStr = "This is a test string.";

describe('Filesystem', () => {
    after(function() {
        fs.removeSync(CONFFILE);
        fs.removeSync(OUTPATH);
        fs.removeSync(OUTDIR);
    });
    describe('save()', () => {
        it ('should be able to save a file', () => {
            assert.strictEqual(fs.existsSync(OUTPATH), false);
            let testfs = new Filesystem(OUTDIR, testConfig);
            testfs.config.meta.debug = false;
            testfs.save(OUTFILE, testStr);
            assert.strictEqual(fs.existsSync(OUTPATH), true);
        });
    });
    describe('load()', () => {
        it ('should be able to read a file', () => {
            let testfs = new Filesystem(OUTDIR, testConfig);
            testfs.config.meta.debug = false;
            let data = testfs.load(OUTFILE);
            assert.strictEqual(data, testStr);
        });
    });

    describe('del()', () => {
        it ('should be able to delete a file', () => {
            assert.strictEqual(fs.existsSync(OUTPATH), true);
            let testfs = new Filesystem(OUTDIR, testConfig);
            testfs.config.meta.debug = false;
            testfs.del(OUTFILE);
            assert.strictEqual(fs.existsSync(OUTPATH), false);
        });
    });
});