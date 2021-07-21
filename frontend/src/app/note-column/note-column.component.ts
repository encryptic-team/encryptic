import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { NotesService } from '../notes.service';
import { ConfigService } from '../config.service';
import { Note } from '../../note';
import { Notebook } from 'src/notebook';
import { MessageService } from '../message.service';
import { NotebooksService } from '../notebooks.service';
import { CryptoService } from '../crypto.service';
import { NoteDataColumnComponent } from '../note-data-column/note-data-column.component';

@Component({
  selector: 'app-note-column',
  templateUrl: './note-column.component.html',
  styleUrls: ['./note-column.component.css']
})
export class NoteColumnComponent implements OnInit {

  constructor(private notesService: NotesService,
              private configService: ConfigService,
              private messageService: MessageService,
              private notebooksService: NotebooksService,
              private cryptoService: CryptoService
              ) { }
  notes: Note[] = [];
  selectedNote: Note;
  noteCount: string;
  title: string;
  book: Notebook = undefined;

  @ViewChild(NoteDataColumnComponent) public child: NoteDataColumnComponent;

  ngOnInit(): void {
    console.log(`note-column ngOnInit(): received ${this.book}`);
    if (this.book !== undefined) {
      this.title = this.book.plaintext.title;
    }
    else {
      this.title = "All Notes";
    }
    this.getNotes();
  }

  // TODO: these need to remembered as configuration parameters
  sortMethod: any = this.sortByModDesc;
  sortImage: any = "/assets/sort.png";

  changeSort() {
    if (this.sortMethod === this.sortByModDesc) {
      this.sortMethod = this.sortByModAsc;
    }
    else {
      this.sortMethod = this.sortByModDesc;
    }
    this.notes = this.notes.sort(this.sortMethod);
    this.toggleSortImage();
  }

  toggleSortImage() {
    if (this.sortImage == "/assets/sort.png") {
      this.sortImage = "/assets/sortu.png";
    }
    else {
      this.sortImage = "/assets/sort.png";
    }
  }

  getNotebookMode() {
    if (this.messageService.length("notebookSelector")) {
      var bookId = this.messageService.get("notebookSelector");
      if (bookId === undefined || bookId === "-2") {
        this.title = "All Notes";
        this.book = undefined;
        this.getNotes();
      }
      else {
        this.notebooksService.getNotebook(bookId)
          .subscribe(book => {
            this.title = book.plaintext.title;
            this.book = book;
            this.getNotes();
          });
      }
    }
    return this.title;
  }

  getNoteCount() {
    var word = "note";
    if (this.notes.length > 1) {
      word = word + 's';
    }
    console.log(`note-column.noteCount(): ${this.notes.length} ${word} found`);
    this.noteCount = `${this.notes.length} ${word}`;
    //return `${this.notes.length} ${word}`;
  }

  getNotes() {
    console.log("getNotes() fired");
    console.log(`getNotes(): Contents of this.book:`);
    console.log(this.book);
    var bookId: string;
    if (this.book !== undefined) {
      bookId = this.book.id;
    }
    this.notesService.getNotes(bookId)
      .subscribe(notes => {
        var noteArray : Note[] = [];
        // This zeros out the note list.  We need to do this in case we view
        // an empty notebook later, otherwise the list will simply not update
        // from whatever was previously populated.
        this.notes = noteArray;
        console.log('subscribed notes:');
        console.log(notes);
        for(let x in notes) {
          this.cryptoService.readKeys('test passphrase')
            .then(() => {
              this.cryptoService.decrypt(notes[x].ciphered)
                .then(data => {
                  var plaintext : string = data.text.toString();
                  notes[x].plaintext = JSON.parse(plaintext);
                  noteArray.push(notes[x]);
                });
          })
        }
        if (noteArray.length > 0) {
          console.log(noteArray);
          console.log("sorting");
          this.notes = noteArray.sort(this.sortMethod);
          console.log("First note from getNotes():");
          console.log(this.notes[0]);
        }
        // update note count
        this.getNoteCount();
        // reselect top note to clear a note that might not be within
        // the current selected notebook anymore.
        this.selectedNote = this.notes[0];
    });
  }

  hasUpdated() {
    var updated = this.messageService.get('noteUpdated');
    if (updated) {
      console.log(`hasUpdated() detected a change, reloading for ${updated}`);
      this.getNotes();
    }
  }

  sortByModDesc(aNote: Note, bNote: Note) : number {
    var a = aNote.plaintext.modified;
    var b = bNote.plaintext.modified;
    if (a > b) {
      return -1;
    }
    else if (a < b) {
      return 1;
    }
    else {
      return 0;
    }
  }

  sortByModAsc(aNote: Note, bNote: Note) : number {
    var a = aNote.plaintext.modified;
    var b = bNote.plaintext.modified;
    if (a > b) {
      return 1;
    }
    else if (a < b) {
      return -1;
    }
    else {
      return 0;
    }
  }

  public newNote(bookId?: string) {
    var note: Note = this.notesService.newNote();
    if (bookId) {
      console.log(`newNote(): setting new note book to ${bookId}`);
      note.plaintext.notebook = bookId;
    }
    this.notes.unshift(note);
    this.onSelect(note);
    this.getNoteCount();
  }

  onSelect(note: Note): void {
    var passphrase = "test passphrase";
    if (this.child.timeout) {
      console.log("onSelect triggered but timeout still set.");
      clearTimeout(this.child.timeout);
      this.child.update();
    }
    this.selectedNote = note;
    /*
    this.cryptoService.readKeys(passphrase)
    .then(() => {
      this.cryptoService.decrypt(note.ciphered)
      .then((data) => {
        note.plaintext = JSON.parse(data.text.toString());
        console.log(`NoteColumn: Selected note id=${note.id}`);
      });
    })
    */
  }

  dateOnly(note: Note): string {
    if (note.plaintext.modified) {
      return note.plaintext.modified.substr(0, 10);
    }
    else {
      return ""; 
    }
  }
}
