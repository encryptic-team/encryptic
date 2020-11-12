import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { Notebook } from '../../notebook';
import { NotebooksService } from '../notebooks.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-menu-dir-view',
  templateUrl: './menu-dir-view.component.html',
  styleUrls: ['./menu-dir-view.component.css']
})

export class MenuDirViewComponent implements OnInit {

  @Output() changeView = new EventEmitter<string>(); 

  setDisplay(mode: string) {
    this.changeView.emit(mode);
  }

  treeview: TreeviewItem[] = [
  new TreeviewItem({
      text: "All Notes",
      value: -2,
      }),
  new TreeviewItem({
    text: "Notebooks",
    value: -1,
    })
  ];

  viewConfig: any = {
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: false,
    decoupleChildFromParent: false,
    maxHeight: 500
  }

  select(item: TreeviewItem) {
    // special cases for standard controls
    if (item.value === -2) {
      console.log(`All notes selected`);
      this.setDisplay("notes");
    }
    if (item.value === -1) {
      console.log(`Notebook view selected`);
      this.setDisplay("notebooks");
    }
    // any other notebook
    console.log(`notebook ${item.value} selected!`);
  }

  constructor(private notebooksService: NotebooksService,
    private configService: ConfigService) {
  }

  resetTreeview(): void {
    this.treeview = [
      new TreeviewItem({
          text: "All Notes",
          value: -2,
          children: [],
          }),
      new TreeviewItem({
        text: "Notebooks",
        value: -1,
        children: [],
        })
      ];
  }

  updateNotebooks(): void {
    this.resetTreeview();
    this.notebooksService.getNotebooks()
      .subscribe(books => {
        console.log('dir-view books:');
        console.log(books);
        for(let i=0; i < this.treeview.length; i++) {
          // this undesirable mess comes courtesy of the weirdness in
          // the ngx-treeview control.  
          // TODO: Replace ngx-treeview with literally anything else.
          if (this.treeview[i].value == -1) {
            console.log(`root notebook found.`);
            var bookKeys = Object.keys(books);
            console.log(`adding ${bookKeys.length} books to view`);
            for(let j=0; j < bookKeys.length; j++) {
              let key = bookKeys[j];
              let text = books[key].plaintext.title;
              if (!text) {
                text = "(untitled)";
              }
              let value = books[key].id;
              var item: TreeviewItem = new TreeviewItem({
                text: text,
                value: value
              });
              console.log(`adding ${item.text} to treeview`);
              if (this.treeview[i].children === undefined) {
                this.treeview[i].children = [item];
              }
              else {
                this.treeview[i].children.push(item);
              }
            }
          }
        }
      });
  }

  ngOnInit(): void {
    this.updateNotebooks();
  }

}
