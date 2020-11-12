import 'dotenv/config';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

class Filesystem {
    constructor(outputDirectory, config) {
        this.outputDirectory = outputDirectory;
        this.config = config.settings;
        // if the directory doesn't exist for some reason we should make it.
        if (!fs.existsSync(outputDirectory)) {
            if (this.debug()) {
                //console.log(`creating new directory ${outputDirectory}`);
            }
            fs.mkdirSync(outputDirectory, {recursive: true});
        }
    }

    debug() {
        return this.config.meta.debug;
    }

    del(id, cb) {
        if (this.config.sync.localCache == 'fs') {
            const outputdir = this.outputDirectory;
            const targetPath = path.join(outputdir, `${id}.json`);
            if (this.debug()) {
                //console.log(`deleting ${targetPath}`);
            }
            fs.unlinkSync(targetPath);
            if (cb && {}.toString.call(cb) === '[object Function]') {
                cb(id);
            }
        }
    }

    save(id, data, cb) {
        if (this.config.sync.localCache == 'fs') {
            if (this.debug()) {
                //console.log(`saving object:`);
                //console.log(data);
            }
            const outputdir = this.outputDirectory;
            const targetPath = path.join(outputdir, `${id}.json`);

            if (this.debug()) {
                //console.log(`writing file ${targetPath}`);
            }
            const outString = data.toString();
            fs.writeFileSync(targetPath, outString);
            if (cb && {}.toString.call(cb) === '[object Function]') {
                return cb(data);
            }
        }
    }

    load(id, cb) {
        if (this.config.sync.localCache == 'fs') {
            const outputdir = this.outputDirectory;
            const targetPath = path.join(outputdir, `${id}.json`);
            var data = fs.readFileSync(targetPath).toString();
            if (this.debug()) {
                //console.log(`contents: ${data}`);
            }
            if (cb && {}.toString.call(cb) === '[object Function]') {
                return cb(data);
            }
            else {
                return data;
            }
        }  
    }

    listDir() {
        return fs.readdirSync(this.outputDirectory);
    }
}

export default Filesystem;
