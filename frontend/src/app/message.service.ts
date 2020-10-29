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