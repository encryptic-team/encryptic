
var assert = require('assert');
const tempy = require('tempy');
const fs = require('fs-extra');
const got = require('got');
import os from 'os';
import path from 'path';

// Config expects a hardcoded environment variable.  
// This should probably change.
process.env.OUTDIR = tempy.directory();

var shutDown = require('../../src/index');

var testData = {
    json: {
        plaintext: {
            contents: 'this is a test note', 
            author: "brad",
            title: "another test"
        },
        ciphered: ""
    },
    responseType: 'json'
};

function pause(milliseconds) {
	var dt = new Date();
    while ((new Date()) - dt <= milliseconds) { /* Do nothing */ 
    }
}

async function connectWithTimeout(httpFunc, url, data=undefined, retry=0) {
    var res;
    try {
        if (data===undefined) {
            res = await httpFunc(url);
        }
        else {
            res = await httpFunc(url, data);    
        }
    }
    catch (error) {
        if (retry<3) {
            console.log("connection to server failed.  Retrying in 1 second");
            pause(1000);
            res = await connectWithTimeout(httpFunc, url, data, retry++);
        }
    }
    return res;
}


describe('Webserver Route Tests', function() {
    after(function() {
        fs.removeSync(process.env.OUTDIR);
        fs.removeSync(process.env.CONFIGFILE);
        shutDown.default();
    });

    describe('/notes/add', function() {
        it ('should create a note when POSTing to /notes/add', function(done) {
            (async (done) => {
                const res = await connectWithTimeout(got.post, 'http://localhost:3000/notes/add', testData);
                return res.body;
            })().then((note) => {
                let file = path.join(os.homedir(), '.encryptic', 'notes', `${note.id}.json`);
                let j = JSON.parse(fs.readFileSync(file));
                assert.equal(j.plaintext.author, 'brad');
                done();
            });
        });
    });
    
    describe('/notes', function() {
        it ('should be able to get a list of notes', function(done) {
            (async (done) => {
                try {
                    const res = await got('http://localhost:3000/notes');
                    var data = res.body;
                    var notes = JSON.parse(data);
                } catch (error) {
                    assert.fail(`Exception caught: ${error}`);
                }
                return notes;
            })().then((notes) => {
                for(let i = 0; i < notes.length; i++) {
                    var noteId = notes[x].id;
                    let file = path.join(os.homedir(), '.encryptic', 'notes', `${noteId}.json`);
                    var j = JSON.parse(fs.readFileSync(file));
                    assert.equal(j.id, noteId);
                }
                done();
            });
        });
    });

    describe('/notes/:noteId', function() {
        it ('should be able to get a specific note', function(done) {
            (async (done) => {
                var note = undefined;
                var newTestData = testData;
                newTestData.json.plaintext.title = 'I changed the title';
                try {
                    const res = await got.post('http://localhost:3000/notes/add', newTestData);
                    note = res.body;
                } catch (error) {
                    assert.fail(`Exception caught: ${error}`);
                }
                return note.id;
            })().then((noteId) => {
                (async (done) => {
                    try {
                        const res = await got(`http://localhost:3000/notes/${noteId}`);
                        var data = res.body;
                        var note = JSON.parse(data);
                    } catch (error) {
                        assert.fail(`Exception caught: ${error}`);
                    }
                    return note;
                })().then((note) => {
                    assert.equal(note.plaintext.title, 'I changed the title');
                    done();
                });
            });   
        });
    });
});
