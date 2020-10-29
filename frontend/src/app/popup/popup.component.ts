import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {

  currentInput: string = "something here";
  newInput: string = "";
  currentTitle: string = "test Title";
  currentText: string[] = ["test contents"];
  currentOk: boolean = true;
  currentCancel: boolean = true;
  currentOkFunc = (res: any) => { return []; };
  errorMessage : string[];
  show: boolean = false;
  status: string = 'normal';

  constructor(public messageService : MessageService) { }
  
  ngOnInit(): void {
    
  }
  
  onChange($event) {
    console.log(this.currentInput);
    this.newInput = this.currentInput;
  }
  
  runOkFunc() {
    var response: string[] = this.currentOkFunc(this.currentInput)
    if (response.length == 0) {
      this.close();
    }
    else {
      console.log(`runOkFunc() returned false`);
      console.log(response);
      this.status = 'error';
      this.errorMessage = response;
    }
  }
  
  public close() {
    // This pops the top message off the list.  This will advance the popup
    // to the next message, if there is another one that's coming up.  If not
    // the popup window will close.
    this.messageService.messages['popup'].shift();
    this.currentTitle = "";
    this.currentText = [];
    this.currentInput = "";
    this.currentOk = true;
    this.currentCancel = true;
    this.errorMessage = [];
    this.status = 'normal';
    this.currentOkFunc = (res) => { return []; };
  }


  get() {
    var msg = this.messageService.messages['popup'][0];
    // Get() loops constantly.  The current way of doing this sin't great.
    // This check below keeps us from stomping on any input change the user
    // has made to the input box.  The nice side-effect of this is that we
    // can also use currentInput to suggest default values to the user.
    if (this.currentTitle != msg.title && this.currentText != msg.text) {
      this.currentTitle = msg.title;
      this.currentText = msg.text;
      this.currentInput = msg.input;
      this.currentOk = msg.ok;
      this.currentCancel = msg.cancel;
      this.currentOkFunc = msg.okFunc;
      this.errorMessage = msg.errorMessage;
    }
    console.log(`text: ${this.currentText}`);
    console.log(`status: ${this.status}`);
    return "";
  }
  
  OnInput(event: any) {
    this.currentInput = event.target.value;
    console.log(`OnInput(): New input is "${this.currentInput}"`);
  }

}
