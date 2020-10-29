import { Component, OnInit, ViewChild} from '@angular/core';
import { NoteColumnComponent } from '../note-column/note-column.component';

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

  public newNote() {
    this.child.newNote();
  }

}
