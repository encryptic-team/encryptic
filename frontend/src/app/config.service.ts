import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


import { Config } from '../config';
import * as localconfig from '../assets/localconfig.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  conf: Config = undefined;
  // TODO: Make this configurable
  //server = "http://localhost:3000"
  server: string = undefined;

  constructor(private http: HttpClient) {
    if (localconfig.local) {
      console.log("configservice: local backend configured");
      this.server = 'http://localhost:3000';
    }
    else {
      this.server = `http://${localconfig.server}:3000`;
    }
  }

  get(): Observable<Config> {
    if (this.conf === undefined) {
      console.log(`http get ${this.server}/notes`);
      return this.http.get<Config>(`${this.server}/config`)
        .pipe(
          tap(config => {
            console.log(`fetched config`);
            console.log(`appVersion: ${config.meta.appVersion}`);
            this.conf = config;
          }));
    }
    else {
      console.log(`using existing current config`);
      return of(this.conf);
    }
  }

  update(settings: Config) {
    this.conf = settings;
    console.log(this.conf);
    var configStr = JSON.stringify(this.conf);
    var res = this.http.post<Config>(`${this.server}/config`, {'settings': configStr});
    console.log(res);
    return res;
  }
}
