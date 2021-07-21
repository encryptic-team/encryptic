import { Component, OnInit, Input } from '@angular/core';
import { Note } from 'src/note';
import { ConfigService } from '../config.service';
import { MessageService } from '../message.service';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-note-preview-column',
  templateUrl: './note-preview-column.component.html',
  styleUrls: ['./note-preview-column.component.css']
})
export class NotePreviewColumnComponent implements OnInit {

  constructor(private configService: ConfigService, 
    private notesService: NotesService,
    private messageService: MessageService) { }
    
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

  isHidden() : boolean {
    var mode = this.messageService.latest('noteViewSelector');
    //console.log(`NotePreviewColumnComponent::isHidden(): mode is ${mode}`);
    if (mode == "preview") {
      //console.log("isHidden() returned false");
      return false;
    }
    else if (mode == "edit") {
      //console.log("isHidden() returned true");
      return true;
    }
    // we want default behavior to be return true;
    //console.log("isHidden() defaulting false");
    return false;
  }

  update() {
    this.note.plaintext.modified = new Date().toISOString();
    var options = {norefresh: true};
    console.log("note-preview-column::update() -> updateNote()");
    this.notesService.updateNote(this.note, options) 
      .subscribe(res => {
        console.log(res);
      });

  }

  onChange($event) {
    console.log("note-preview-column::onChange() data changed, updating");
    clearTimeout(this.timeout);
    return new Promise(resolve => {
      this.timeout = setTimeout(() => {
        this.update();
      }, 1000);
    });
  }
}
