import { Component, OnInit, Input } from '@angular/core';
import { NotesService } from '../notes.service';
import { NotebooksService } from '../notebooks.service';
import { Notebook } from '../../notebook';
import { Note } from '../../note';

@Component({
  selector: 'app-note-toolbar',
  templateUrl: './note-toolbar.component.html',
  styleUrls: ['./note-toolbar.component.css']
})
export class NoteToolbarComponent implements OnInit {

  notebooks: Notebook[] = [];
  @Input() note: Note; 
  constructor( private notesService: NotesService,  private notebooksService: NotebooksService) { };
  
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

  onNotebookChange(e) {
    console.log(e.target.value);
    this.notesService.updateNote(this.note)
      .subscribe(res => {
        console.log(`updated with message: `);
        console.log(res);
      })
  }

}
