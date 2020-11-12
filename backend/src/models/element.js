/*
 An element can be a notebook or a note or something entirely else.  It is
 a unit of data somewhere that has been encrypted.  The only two values
 exposed to any eyeballs looking at it are the contents and a uuid to identify
 it by.

 Example Element:	
 {
    "plaintext": {	 
        "author": "none",	      
        "title": "you should not see this when this is encrypted",	
        "content": "note that you should not see when encrypted"	
    },
    "ciphered": "a;sdlkfuapw08fajapwoifmas.d;fkja s; oibrtjb3pn985j3nr-ba890"	
    "id": "b7a10ac9-cf40-4d23-914e-ae36d2318a36"
 }

*/

class Element {

    // Constructor assumes JSON object.
    constructor(data) {
        this.fromObject(data);
    }

    fromObject(data) {
        if (data) {
            this.ciphered = data.ciphered ? data.ciphered : "";
            this.plaintext = data.plaintext ? data.plaintext : {};
            this.id = data.id ? data.id : "";
        }
        else {
            this.ciphered = "";
            this.plaintext = {};
            this.id = "";
        }
    }

    fromString(text) {
        let data = JSON.parse(text);
        this.fromObject(data);
    }

    toString() {
        return JSON.stringify({"plaintext": this.plaintext, "ciphered": this.ciphered, "id": this.id});
    }
}

export default Element;