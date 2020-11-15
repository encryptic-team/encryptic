import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config.service';
import { Config } from '../../config';
import { NotesService } from '../notes.service';
import { NoteViewComponent } from '../note-view/note-view.component';
import { ConfigMenuComponent } from '../config-menu/config-menu.component';
import { MenuDirViewComponent } from '../menu-dir-view/menu-dir-view.component';
import { delay } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { Notebook } from '../../notebook';
import { NotebooksService } from '../notebooks.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})

export class MenuBarComponent implements OnInit {

  constructor(public messageService: MessageService, private configService: ConfigService,
              private notesService: NotesService, private notebooksService: NotebooksService) { }

  ngOnInit(): void {
    this.getConfig();
    // this is one of the first components to load, so it's going to be where I
    // initialize the message service queue names.  There's probably a better
    // way of doing this than I am right now, but until it becomes needed
    // and presents itself as a viable alternative, I will stick with this for now.
    this.messageService.createQueue('notification');
    this.messageService.createQueue('popup');
    this.messageService.createQueue('notebookSelector');
  }

  config: Config = undefined;
  server: string = undefined;
  message: string = undefined;
  display: string = "notes";
  selectedBook: string = undefined;

  @ViewChild(ConfigMenuComponent) public configMenuChild: ConfigMenuComponent;
  @ViewChild(NoteViewComponent) public child: NoteViewComponent;
  @ViewChild(MenuDirViewComponent) public menuDirChild: MenuDirViewComponent;

  changeView(mode: string) {
    console.log(`changeView(): caught emitted ${mode}`);
    if (mode == "notebooks") {
      this.display = mode;
    }
    else if (mode.startsWith("notebook")) {
      // this means that we are viewing a specific notebook
      // as-in "notebook <uuid>".  There's probably a better
      // way of doing this.
      this.display = 'notes';
      let bookId = mode.split(' ')[1];
      if (bookId == '-2') {
        console.log("Selected notebook view for : All Notes");
      }
      this.selectedBook = bookId;
      this.messageService.add("notebookSelector", bookId);
      /*
      else {
        this.notebooksService.getNotebook(bookId)
          .subscribe(book => {
            console.log(`Selected notebook view for : ${book.id}`);
            this.selectedBook = book;
          });
      }
      */
    
    }
  }

  toggleShowConfig() {
    this.configMenuChild.showConfig();
  }

  // delete this later (or even better, use it in a test)
  fakeMsg = { 
    title: "This is a popup window!",
    text: ["This is the sample text for the popup window.",
          "It could be directions or information or something else."],
    input: "This is the placeholder for the input box.",
    ok: true,
    okFunc: (res: any) => {
      console.log(res);
    },
    cancel: false
  }

  clickNewNote() {
    console.log("new note was clicked");
    // TODO: This doesn't work right if the view isn't already on notes
    // This can be fixed by removing ngIf on the views and hiding/showing
    // them via CSS attributes instead.  I'm not sure if this would involve
    // a performance hit, but it's probably a little too early to worry
    // about that.
    this.changeView("notes");
    // handle "All Notes" (no selected notebook) case
    var bookId = (this.selectedBook == '-2') ? "" : this.selectedBook; 
    console.log(`clickNewNote(): calling newNote() with notebook ${bookId}`);
    this.child.newNote(bookId);
  }

  getConfig() {
    this.server = this.configService.server;
    this.configService.get()
      .subscribe(conf => {
        console.log(conf);
        this.config = conf;
      });
  }

}
