import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  messages: {} = {};

  createQueue(queueName: string) {
    if (this.messages[queueName] === undefined) {
      this.messages[queueName] = [];
    }
  }

  length(queueName: string) {
    if (this.messages[queueName] !== undefined) {
      return this.messages[queueName].length;
    }
  }

  peek(queueName: string) {
    if (this.messages[queueName] !== undefined && 
        this.length(queueName) > 0) {
      return this.messages[queueName][0];
    }
  }

  latest(queueName: string) {
    if (this.messages[queueName] !== undefined && 
        this.length(queueName) >= 1) {
      let lastIdx = this.messages[queueName].length-1;
      var msg = this.messages[queueName][lastIdx];
      return msg;
      }
  }

  add(queueName: string, message: any) {
    this.messages[queueName].push(message);
  }

  get(queueName: string) {
    return this.messages[queueName].shift();
  }

  clear(queueName: string) {
    this.messages[queueName] = [];
  }
}