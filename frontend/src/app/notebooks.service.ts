import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, config} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Note } from '../note';
import { Notebook } from '../notebook';
import uuid from 'uuid/v4';

@Injectable({
  providedIn: 'root'
})
export class NotebooksService {

  constructor(private http: HttpClient, private config: ConfigService ) { }
  // TODO: Make this configurable
  //server = "http://localhost:3000";
  server = this.config.server;

  getNotebooks(): Observable<Notebook[]> {
    console.log(`http get ${this.server}/notebooks`);
    return this.http.get<Notebook[]>(`${this.server}/notebooks`)
    .pipe(
      tap(test => console.log(`fetched notebooks: ${Object.keys(test)}`))
      );
  }

  getNotebook(bookid: string): Observable<Notebook> {
    return this.http.get<Notebook>(`${this.server}/notebooks/${bookid}`)
      .pipe(
        tap(test => console.log(`fetched one notebook: ${Object.keys(test)}`))
      );
  }

  updateNotebook(book: Notebook): Observable<ArrayBuffer> {
    console.log("updateNotebook() fired");
    if (book.new) {
      // Undefine new so we don't send it out with the other notes.
      book.new = undefined;
      console.log(book);
      console.log(`POSTing to ${this.server}/notebooks/add`)
      return this.http.post<ArrayBuffer>(`${this.server}/notebooks/add`, book)
      .pipe(
        tap(test => console.log(`POST update for ${book.id}, response ${test}`))
      );
    }
    else {
      return this.http.post<ArrayBuffer>(`${this.server}/notebooks/${book.id}`, book)
        .pipe(
          tap(test => console.log(`POST update for ${book.id}, response ${test}`))
        );
    }
  }

  newBook(): Notebook {
    var book : Notebook;
    book = {
      plaintext: {
        title: "(untitled)",
        version: 1,
        author: "test name",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        comment: "",
        notes: []
      },
      ciphered: "",
      id: uuid(),
      new: true
    };
    // TODO: Add name property to configuration
    return book; 
  }
}
