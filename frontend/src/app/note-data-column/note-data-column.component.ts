import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/note';
import { ConfigService } from '../config.service';
import { NotesService } from '../notes.service';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import { MessageService } from '../message.service';
import { CryptoService } from '../crypto.service';
import { not } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-note-data-column',
  templateUrl: './note-data-column.component.html',
  styleUrls: ['./note-data-column.component.css']
})
export class NoteDataColumnComponent implements OnInit {

  constructor(private configService: ConfigService, 
              private notesService: NotesService,
              private messageService: MessageService,
              private cryptoService: CryptoService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log("note-data-column::ngOnDestroy():");
    if (this.timeout) {
      console.log("note-data-column::ngOnDestroy(): timer still active!");
      this.update();
      clearTimeout(this.timeout);
    }
  }
  
  @Input() note: Note;
  timeout : number = null;

  formatdt() {
    var mtime : string;
    if (this.note.plaintext.modified) {
      mtime = this.note.plaintext.modified
        .replace('T', ' ')
        .replace('Z', ' ')
        .substr(0, 19);
    }
    else {
      mtime = "<unknown time>";
    }
    return mtime;
  }

  update() {
    this.note.plaintext.modified = new Date().toISOString();
    console.log("note-data-column::update():");
    console.log(this.note);
    this.encryptFunc();
  }


  encryptFunc() {
    var passphrase = "test passphrase";
    this.cryptoService.readKeys(passphrase)
      .then(() => {
        this.cryptoService.encrypt(JSON.stringify(this.note.plaintext))
          .then((encrypt) => {
            this.note.ciphered = encrypt.payload;
            console.log("encryptFunc() -> updateNote()"); 
            const options = {norefresh: true};
            this.notesService.updateNote(this.note, options)
            .subscribe(res => {
              console.log(res);
            });
          });
      });
  };

  makeKeyIfNeeded() {
    var passphrase = "test passphrase";
    const res = this.cryptoService.loaded;
    console.log("testEncrypt()");
    console.log(res);
    // we already had a saved key
    if (!res) {
      this.cryptoService.generateKey("Brad Arnett", "brad.arnett@notforhire.org", passphrase)
        .then((res) => {
          console.log(res);
        });
    }
  }  

  onChange($event) {
    console.log("data changed, updating");
    clearTimeout(this.timeout);
    return new Promise(resolve => {
      this.timeout = setTimeout(() => {
        this.update();
      }, 1000);
    });
  }

  isHidden() : boolean {
    var mode = this.messageService.latest('noteViewSelector');
    //console.log(`NoteDataColumnComponent::isHidden(): mode is ${mode}`);
    if (mode == "preview") {
      //console.log("isHidden() returned true");
      return true;
    }
    else if (mode == "edit") {
      //console.log("isHidden() returned false");
      return false;
    }
    // we want default behavior to be return false;
    //console.log("isHidden() defaulting true");
    return true;
  }

}
