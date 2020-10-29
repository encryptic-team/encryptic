var assert = require('assert');
const tempy = require('tempy');
const fs = require('fs-extra');

import Config from '../../src/components/config';

// Config expects a hardcoded environment variable.  
// This should probably change.
process.env.CONFIGFILE = tempy.file({extension: 'xml'});
process.env.OUTDIR = tempy.directory();

describe('Config', function() {
  	after(function() {
		fs.removeSync(process.env.OUTDIR);
		fs.removeSync(process.env.CONFIGFILE);
	});
  
	describe('config()', function() {
		it ('should write a default config out on first run', function() {
			fs.rmdir((process.env.CONFIGFILE), () => {});
			let testcnf = new Config();
			// test a parameter so we know the object worked.
			if (testcnf.settings.sync.cloudStorage == 'p2p') {
				// config exists
				if (fs.existsSync(process.env.CONFIGFILE)) {
					assert.equal(fs.existsSync(process.env.CONFIGFILE), true);
					fs.rmdir((process.env.CONFIGFILE), () => {});
				};
			}
		});
  	});

  	describe('save()', function() {
    	it('should be able to save a config change', function() {
			let testcnf = new Config();
			const defaultText = testcnf.settings.sync.cloudStorage;
			testcnf.settings.sync.cloudStorage = "dropbox";
			testcnf.save();
			// TODO: this deserves a better way of proving it actually wrote the file
			assert.equal(fs.existsSync(testcnf.filename), true);
		});

    
		it ('should be able to read the config file it wrote', function() {
			// new config time
			let newcnf = new Config();
			// test the parameter so we know the save happened worked.
			assert.equal(newcnf.settings.sync.cloudStorage, 'dropbox');
		});
	});
});




