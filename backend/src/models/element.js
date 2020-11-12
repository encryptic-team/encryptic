/*
 An element can be a notebook or a note or something entirely else.  It is
 a unit of data somewhere that has been encrypted.  The only two values
 exposed to any eyeballs looking at it are the contents and a uuid to identify
 it by.

 Example Element:
{ 
    "contents": {
        "encrypted": "a;sdlkfuapw08fajapwoifmas.d;fkja s; oibrtjb3pn985j3nr-ba890"
    },
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
            this.contents = data.contents ? data.contents : {};
            this.id = data.id ? data.id : "";
        }
        else {
            this.contents = {};
            this.id = "";
        }
    }

    fromString(text) {
        let data = JSON.parse(text);
        this.fromObject(data);
    }

    toString() {
        return JSON.stringify({"contents": this.contents, "id": this.id});
    }
}

export default Element;