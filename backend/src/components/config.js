import defaultConfig from './defaultConfig';
import fs from 'fs';
import path from 'path';
import os from 'os';
import 'dotenv/config';

class Config {
    constructor(configpath=undefined) {
        if (configpath === undefined) {
            this.outputdir = path.join(os.homedir(), '.encryptic', 'conf');
            this.filename = path.join(this.outputdir, 'encryptic.conf');
            //console.log(`using default path ${this.filename}`);
        }
        else {
            this.outputdir = path.dirname(configpath);
            this.filename = configpath;
        }
        //console.log(`Config file location: ${this.filename}`);
        if (fs.existsSync(this.filename)) {
            try {
                this.confFile = fs.readFileSync(this.filename);
                try {
                    var conf = JSON.parse(this.confFile);
                }
                catch(error) {
                    console.error(`Parsing error.  Dumping config file at ${this.filename}`);
                    fs.open(this.filename, (err, fd) => {
                        console.error(fd);
                    });
                }
                this.settings = conf;
                //console.log('parsed config file successfully');
                //console.log(`appVersion: ${conf.meta.appVersion}`);
            }
            catch(error) {
                console.error(error);
                this.settings = defaultConfig;
                this.save();
            }
        }
        // no file exists
        else {
            this.settings = defaultConfig;
            this.save();
        }
    }

    save() {
        if (!fs.existsSync(this.outputdir)) {
            if (this.debug) {
                console.log(`creating new directory ${this.outputdir}`);
            }
            fs.mkdirSync(this.outputdir, {recursive: true});
        }
        //console.log(this.filename);
        return fs.writeFileSync(this.filename, JSON.stringify(this.settings));
    }
}

export default Config;