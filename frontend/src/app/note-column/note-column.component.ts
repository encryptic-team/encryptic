import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NotesService } from '../notes.service';
import { ConfigService } from '../config.service';
import { Note } from '../../note';

@Component({
  selector: 'app-note-column',
  templateUrl: './note-column.component.html',
  styleUrls: ['./note-column.component.css']
})
export class NoteColumnComponent implements OnInit {

  constructor(private notesService: NotesService,
              private configService: ConfigService) { }
  notes: Note[] = [];
  selectedNote: Note;
  noteCount: string;
  ngOnInit(): void {
    this.getNotes();
  }

  @Input() control: string;
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

  getNoteCount() {
    var word = "note";
    if (this.notes.length > 1) {
      word = word + 's';
    }
    console.log(`note-column.noteCount(): ${this.notes.length} ${word} found`)
    this.noteCount = `${this.notes.length} ${word}`;
    //return `${this.notes.length} ${word}`;
  }

  getNotes() {
    console.log("getNotes() fired");
    this.notesService.getNotes()
      .subscribe(notes => {
        var noteArray : Note[] = [];
        console.log(notes);
        for(let x in notes) {
          noteArray.push(notes[x]);
        }
        this.notes = noteArray.sort(this.sortMethod);
        console.log("First note from getNotes():");
        console.log(this.notes[0]);
        this.getNoteCount();
    });
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

  public newNote() {
    var note: Note = this.notesService.newNote();
    this.notes.unshift(note);
    this.onSelect(note);
    this.getNoteCount();
  }

  onSelect(note: Note): void {
    this.selectedNote = note;
    console.log(`NoteColumn: Selected note id=${note.id}`);
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
