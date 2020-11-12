import os from 'os';
import path from 'path';
import uuid from 'uuid/v4';

import Filesystem from './storage/filesystem';
import Config from './config';
import Element from '../models/element';
import 'dotenv/config';

class Sync {
    constructor(config, role) {
        this.config = config.settings;
        this.role = role;
        this.mode = config.settings.sync.localCache;
        if (this.mode == 'fs') {
            // TODO: This should make it into the config at some point. 
            if (process.env.OUTDIR) {	
                var dataDir = path.join(os.homedir(), "/.encryptic/", role);	
            }	
            else {	
                var dataDir = path.join(os.homedir(), "/.encryptic/", role);	
            }
            this.use = new Filesystem(dataDir, config);
        }
    }

    create(params, cb) {
        var el = new Element(params);
        // add a uuid if we didn't have one before
        el.id = el.id != "" ? el.id : uuid();
        this.use.save(el.id, el, cb);
    }

    update(params, cb) {
        if (params.id === undefined || params.id == "") {
            throw "update(): UUID is blank or undefined!";
        }
        var el = new Element(params);
        this.use.save(el.id, el, cb);
    }

    get(params) {
        if (params.id === undefined || params.id == "") {
            throw "cannot get() without a uuid in params!";
        }
        var el = new Element();
        el.fromString(this.use.load(params.id));
        //console.log(`Element: ${el}`);
        return el;
    }
    
    del(params, cb) {
        if (params.id === undefined || params.id == "") {
            throw "cannot del() without a uuid in params!";
        }
        this.use.del(params.id, cb);
    }

    listUUIDs() {
        var idList = this.use.listDir();
        for (let i = 0; i < idList.length; i++) {
            // remove the extension from the filename, assuming always json
            idList[i] = idList[i].slice(0, -5);
        }
        return idList;
    }
}

export default Sync;