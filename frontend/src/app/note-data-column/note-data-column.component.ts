import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/note';
import { ConfigService } from '../config.service';
import { NotesService } from '../notes.service';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';

@Component({
  selector: 'app-note-data-column',
  templateUrl: './note-data-column.component.html',
  styleUrls: ['./note-data-column.component.css']
})
export class NoteDataColumnComponent implements OnInit {

  constructor(private configService: ConfigService, 
              private notesService: NotesService) { }

  ngOnInit(): void {
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
    this.notesService.updateNote(this.note)
      .subscribe(res => {
        console.log(res);
      });
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

}
