import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { NoteColumnComponent } from '../note-column/note-column.component';
import { Notebook } from '../../notebook';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.css']
})
export class NoteViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild(NoteColumnComponent) public child: NoteColumnComponent;

  public newNote(book?: string) {
    this.child.newNote(book);
  }

}
