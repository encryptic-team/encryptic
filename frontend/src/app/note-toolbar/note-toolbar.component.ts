import { Component, OnInit, Input } from '@angular/core';
import { NotesService } from '../notes.service';
import { NotebooksService } from '../notebooks.service';
import { Notebook } from '../../notebook';
import { Note } from '../../note';
import { MessageService } from '../message.service';
import { CryptoService } from '../crypto.service';

@Component({
  selector: 'app-note-toolbar',
  templateUrl: './note-toolbar.component.html',
  styleUrls: ['./note-toolbar.component.css']
})
export class NoteToolbarComponent implements OnInit {

  notebooks: Notebook[] = [];
  @Input() note: Note;
  @Input() mode: String;
  privateKeyArmored: any;
  publicKeyArmored: any;
  passphrase: any;

  constructor( private notesService: NotesService,  
               private notebooksService: NotebooksService,
               private messageService: MessageService,
               private cryptoService: CryptoService) { };
  
  ngOnInit(): void {
    // define a "null notebook" for notes outside of notebooks.
    var nullbook: Notebook = {
      "id": '',
      "new": false,
      "ciphered": '',
      "plaintext": {
        "title": '(no notebook)',
        "version": 0,
        "notes": [],
        "created": '',
        "modified": '',
        "comment": '',
        "author": ''
      }
    };

    console.log("toolbar detected active note:");
    console.log(this.note.id);
    this.notebooks.push(nullbook);
    this.notebooksService.getNotebooks()
      .subscribe(books => {
        /*
        console.log("loaded books for notebook selector:");
        console.log(books);
        */
        for(let x in books) {
          this.notebooks.push(books[x]);
        }
        /*
        console.log("end result of this.notebooks:");
        for(let book of this.notebooks) {
          console.log(book.id);
          console.log(book.plaintext.title);
        }
        */
      });
  }

  changeMode(newMode: string) {
    var queueName = 'noteViewSelector';
    this.messageService.clear(queueName);
    this.messageService.add(queueName, newMode);
  }

  encryptFunc() {
    this.cryptoService.readKeys(this.passphrase)
      .then(() => {
        this.cryptoService.encrypt(JSON.stringify(this.note.plaintext))
          .then((encrypt) => {
            this.note.ciphered = encrypt.payload;
            console.log("note-toolbar::encryptFunc()-> updateNote()");
            this.notesService.updateNote(this.note)
            .subscribe(res => {
              console.log(res);
            });
          });
      });
  };

  testEncrypt() {
    /*
    this.passphrase = "test passphrase";
    const res = this.cryptoService.getKey();
    console.log("testEncrypt()");
    console.log(res);
    // we already had a saved key
    if (res.success) {
      this.encryptFunc(res);
    }
    // or, we didn't
    else {
      this.cryptoService.generateKey("Brad Arnett", "brad.arnett@notforhire.org", this.passphrase)
        .then((data) => {
          this.encryptFunc(data);      
        });
    }
    */
  }

  getPubHash() {
    return this.cryptoService.hash("public");
  }

  getPrivHash() {
    return this.cryptoService.hash("private");
  }


  testDecrypt() {
    this.cryptoService.readKeys(this.passphrase)
      .then(() => {
        this.cryptoService.decrypt(this.note.ciphered)
          .then((data) => {
            this.note.plaintext = JSON.parse(data.text.toString());
            console.log("note-toolbar::testDecrypt()");
            console.log(this.note.plaintext);
        });
      });
    }

  onNotebookChange(e) {
    console.log(e.target.value);
    console.log("note-toolbar::onNotebookChange()-> updateNote()");
    this.notesService.updateNote(this.note)
      .subscribe(res => {
        console.log(`updated with message: `);
        console.log(res);
      })
  }
}
