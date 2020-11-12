import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NotebooksService } from '../notebooks.service';
import { ConfigService } from '../config.service';
import { MessageService } from '../message.service';
import { Notebook } from '../../notebook';
import { Popup } from '../../popup';

@Component({
  selector: 'app-notebook-view',
  templateUrl: './notebook-view.component.html',
  styleUrls: ['./notebook-view.component.css']
})
export class NotebookViewComponent implements OnInit {

  constructor(private messageService: MessageService,
    private notebooksService: NotebooksService,
    private configService: ConfigService) { }

  notebooks: Notebook[];
  notebookCount: string;

  ngOnInit(): void {
    this.getBooks();
  }

  newNotebookMsg: Popup = {
    title: "New Notebook",
    text: ["Please pick out a great name for your brand new notebook!"],
    input: "Untitled",
    errorMessage: [],
    ok: true,
    okFunc: (name) => {
      let book = this.notebooksService.newBook();
      book.plaintext.title = name;
      for (let i=0; i<this.notebooks.length; i++) {
        if (this.notebooks[i].plaintext.title == name) {
          let errorMessage = ["Oops! That name is already in use."];
          console.log(errorMessage)
          return errorMessage;
        }
      }
      this.notebooksService.updateNotebook(book)
        .subscribe((res) => {
          console.log(res);
          this.getBooks();
        });
      return [];
    },
    cancel: true
  }
  
  getNotebookCount() {
    var word = "notebook";
    if (this.notebooks.length > 1) {
      word = word + 's';
    }
    console.log(`notebook-view.noteCount(): ${this.notebooks.length} ${word} found`)
    this.notebookCount = `${this.notebooks.length} ${word}`;
    //return `${this.notes.length} ${word}`;
  }
  
  getBooks() {
    console.log("getBooks() fired");
    this.notebooksService.getNotebooks()
    .subscribe(books => {
      console.log(books);
      this.notebooks = [];
      for(let key in books) {
        if (books[key].plaintext === undefined) {
          console.log("getBooks(): plaintext is hosed and should be readable at this point");
          books[key] = this.notebooksService.newBook();
          books[key].plaintext.title = "(broken notebook plaintext)";
        }
        this.notebooks.push(books[key]);
      }
      // TODO: Needs notebook sort implementations
      // this.notebooks.sort()
      console.log(this.notebooks[0]);
      this.getNotebookCount();
    });
  }
  
  public newNotebook(): void {
    console.log("newNotebook() fired!");
    this.messageService.add('popup', this.newNotebookMsg);
    /*
    var book: Notebook = this.notebooksService.newBook();
    this.notebooks.unshift(book);
    this.notebooksService.updateNotebook(book)
      .subscribe((res) => {
        console.log(res);
      });
    */

  }
}
