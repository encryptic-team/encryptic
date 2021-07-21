import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, config} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { MessageService } from './message.service';
import { Note } from '../note';
import uuid from 'uuid/v4';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  constructor(private http: HttpClient, 
              private config: ConfigService,
              private messageService: MessageService ) { }
  // TODO: Make this configurable
  //server = "http://localhost:3000";
  server = this.config.server;

  getNotes(notebook?:string): Observable<Note[]> {
      console.log(`http get ${this.server}/notes`);
      return this.http.get<Note[]>(`${this.server}/notes`)
      .pipe(
        tap(test => {
          //var dummy = [{id: "asdf", author: "qqqq", title: "werasdfasdf", contents: "afsdfasdf"}];
          console.log(`fetched notes: ${Object.keys(test)}`);
          if (notebook) {
            for (let x in test) {
              console.log(`${test[x].plaintext.notebook} != ${notebook}?`);
              if (test[x].plaintext.notebook != notebook) {
                console.log(`removing ${x} because not in notebook ${notebook}`);
                delete test[x];
              }
              else {
                console.log(`${test[x].id} in notebook ${notebook}`);
              }
            }
          }
        })
      );
  }


  getNote(noteid: string): Observable<Note> {
    return this.http.get<Note>(`${this.server}/notes/${noteid}`)
      .pipe(
        tap(test => console.log(`fetched one note: ${Object.keys(test)}`))
      );
  }

  updateNote(note: Note, options?): Observable<ArrayBuffer> {
    console.log("updateNote() was triggered");
    console.log(note);
    options = options ? options : {};
    console.log("options:");
    console.log(options);
    if (!options.norefresh) {
      this.messageService.add('noteUpdated', note.id);
    }
    var payload : Note = this.newNote();
    //Object.assign(payload, note);
    payload = JSON.parse(JSON.stringify(note));
    
    console.log('note: ');
    console.log(note);
    console.log('payload:');
    console.log(payload);
    if (this.config.conf.encryption.encrypt) {
      payload.plaintext.contents = "";
      payload.plaintext.title = "";
    }
    console.log("after stripping contents/title")
    console.log('note: ');
    console.log(note);
    console.log('payload:');
    console.log(payload);
    if (note.new) {
      // Undefine new so we don't send it out with the other notes.
      payload.new = undefined;
      note.new = undefined;
      return this.http.post<ArrayBuffer>(`${this.server}/notes/add`, payload)
      .pipe(
        tap(test => console.log(`POST update for ${payload.id}, response ${test}`))
      );
    }
    else {
      return this.http.post<ArrayBuffer>(`${this.server}/notes/${payload.id}`, payload)
        .pipe(
          tap(test => console.log(`POST update for ${payload.id}, response ${test}`))
        );
    }
  }

  validateData(dirtyNote: Note) {

  }

  newNote(): Note {
    var note : Note;
    note = {
      plaintext: {
        author: "test name",
        contents: "",
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: 3,
        title: "",
        notebook: "",
      },
      new: true,
      ciphered: "", 
      id: uuid()
    };
    // TODO: Add name property to configuration
    return note;
  }
}
