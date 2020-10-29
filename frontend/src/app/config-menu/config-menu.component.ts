import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../config.service';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import '../../config';
import { Config } from '../../config';

@Component({
  selector: 'app-config-menu',
  templateUrl: './config-menu.component.html',
  styleUrls: ['./config-menu.component.css']
})
export class ConfigMenuComponent implements OnInit {

  constructor(private configService: ConfigService) { }
  
  windowMode: string;
  config: string;

  ngOnInit(): void {
    this.windowMode = "hidden";
    this.configService.get()
      .subscribe(conf => {
        console.log('ConfigMenuComponent: received config:');
        console.log(conf);
        this.config = JSON.stringify(conf, null, 2);
      });
  }

  public close() {
    var configObj: Config = JSON.parse(this.config);
    console.log(`configMenuComponent: Parsed config: ${configObj}`);
    this.configService.update(configObj)
      .subscribe(out => {
        console.log("Whatever is coming back from posting the config changes:");
        console.log(out);
      });
    this.windowMode = "hidden";
  }

  public showConfig() {
    console.log(`Show config was set to ${this.windowMode}`);
    if (this.windowMode == "config") {
      this.windowMode = "hidden";
    }
    else {
      this.windowMode = "config";
    }
  }

}
