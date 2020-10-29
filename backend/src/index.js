import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import os from 'os';
import path from 'path';
import { stringify } from 'querystring';

import Sync from './components/sync';
import Config from './components/config';

const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

var encrypticDir = path.join(os.homedir(), ".encryptic/");
var defaultConfPath = path.join(encrypticDir, "conf/encryptic.conf");

var output = process.env.OUTDIR ? process.env.OUTDIR : encrypticDir;
var config = process.env.CONFIGFILE ? process.env.CONFIGFILE : defaultConfPath;
var port = process.env.PORT ? process.env.PORT : 3000;

process.env.OUTDIR = output;
process.env.CONFIGFILE = config;
process.env.PORT = port;

var conf = new Config(defaultConfPath);
conf.settings.meta.debug = true;

// Create our collections
var notes = new Sync(conf, "notes");
console.log(`debug: notes writing to ${notes.use.outputDirectory}`);
var notebooks = new Sync(conf, "notebooks");
console.log(`debug: notebooks writing to ${notebooks.use.outputDirectory}`);

// see also .put() .post() and .delete()
app.get('/', (req, res) => {
    res.send('<div>encryptic server api page</div>\
    <div>version 1.0</div>\
    <div>http://localhost:3000/notes</div>\
    <div>http://localhost:3000/notes/add</div>\
    <div>http://localhost:3000/notes/:noteid (GET / POST / DELETE)</div>\
    <div>http://localhost:3000/notebook</div>\
    <div>http://localhost:3000/notebook/add</div>\
    <div>http://localhost:3000/notebook/:bookid (GET / POST / DELETE)</div>\
    ');
});

/*  CONFIG ROUTES  */
app.get('/config', (req, res) => {
    res.send(conf.settings);
});

app.post('/config', (req, res) => {
    // TODO: should validate config before saving it.
    console.log("received new config:");
    console.log(req.body);
    conf.settings = JSON.parse(req.body.settings);
    console.log("parser results:");
    console.log(conf.settings);
    conf.save();
    res.send({status: 'accepted'});
});

/*  END CONFIG ROUTES  */

/*  NOTE ROUTES  */

app.get('/notes', (req, res) => {
    var noteList = notes.listUUIDs();
    var payload = {};
    for (let i = 0; i < noteList.length; i++) {
        payload[noteList[i]] = notes.get({id: noteList[i]});
    }
    res.send(payload);
});

app.post('/notes/add', (req, res) => {
    notes.create(req.body, (id) => {
        res.send(id);
    });
});

app.post('/notes/:noteId', (req, res) => {
    req.body.id = req.params.noteId;
    notes.update(req.body, (id) => {
        res.send(id);
    });
});

app.get('/notes/:noteId', (req, res) => {
    req.body.id = req.params.noteId;
    res.send(notes.get(req.body));
});

app.delete('/notes/:noteId', (req, res) => {
    notes.del(req.params, (id) => {
        res.send(id);
    });
});

/*  END NOTE ROUTES  */

/*  NOTEBOOK ROUTES  */

app.get('/notebooks', (req, res) => {
    var bookList = notebooks.listUUIDs();
    var payload = {};
    for (let i = 0; i < bookList.length; i++) {
        payload[bookList[i]] = notebooks.get({id: bookList[i]});
    }
    res.send(payload);
});

app.post('/notebooks/add', (req, res) => {
    notebooks.create(req.body, (id) => {
        res.send(id);
    });
});

app.post('/notebooks/:noteId', (req, res) => {
    req.body.id = req.params.noteId;
    notebooks.update(req.body, (id) => {
        res.send(id);
    });
});

app.get('/notebooks/:noteId', (req, res) => {
    req.body.id = req.params.noteId;
    res.send(notebooks.get(req.body));
});

app.delete('/notebooks/:noteId', (req, res) => {
    notebooks.del(req.params, (id) => {
        res.send(id);
    });
});

/*  END NOTEBOOK ROUTES  */

var server = app.listen(port, '0.0.0.0' , () =>
  console.log(`backend app listening on port ${port}!`),
);

function shutDown() {
    server.close(() => {

    });
/*
    setTimeout(() => {
        console.error("Process took too long to shut down.  Connections might be aborted.")
        process.exit(1);
    }, 2000);
    */
}

export default shutDown;