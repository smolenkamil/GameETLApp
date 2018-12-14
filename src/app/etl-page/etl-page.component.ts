import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import {flatMap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-etl-page',
  templateUrl: './etl-page.component.html',
  styleUrls: ['./etl-page.component.css']
})
export class EtlPageComponent implements OnInit {

  consoleMessages = ["---"]

  constructor(private api: ApiService) { }

  stage = "extract"

  buttonDis = [
    false,
    true,
    true
  ]
  spinMode = 'indeterminate'

  loading: boolean = false;

  stagelog:string = ""

  all(){
    this.stagelog ="Commiting extraction!";
    this.loading = true;
    this.refreshBtns()
    this.api.extract()
      .subscribe(res => {
        console.log(res);
        this.stagelog ="";
        this.stage = "transform"
        this.refreshBtns()
        this.all2Step()

      }, err => {
        console.log(err);
      });
  }
  all2Step() {
    this.stagelog ="Don't think is nothing!";
    this.refreshBtns();
    this.api.transform()
      .subscribe(res => {
        console.log(res);
        this.stagelog ="";
        this.stage = "load"
        this.refreshBtns()
        setTimeout(()=> {
          this.all3Step()
        },1000)
      }, err => {
        console.log(err);
      });
  }

  all3Step(){
    this.stagelog ="Loading!"
    this.refreshBtns()
    this.api.load('load')
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.stagelog ="";
        this.stage = "extract"
        this.refreshBtns()
      }, err => {
        console.log(err);
      });
  }

  nextStage(){
    switch(this.stage){
      case "extract":
        this.extractProcess()
        break;
      case "transform":
        this.transformProcess()
        break;
      case "load":
        this.loadProcess()
        break;
    }
  }

  ngOnInit() {
    setInterval(()=>{
      this.api.getConsoleMessages()
        .subscribe(res => {
          console.log(res);
          var tmp = res.messages
          for(var i=0;i<tmp.length;i++){
            if(this.consoleMessages[0].startsWith("--") && tmp[i].startsWith("--"))
              this.consoleMessages[0] = tmp[i]
            else
              this.consoleMessages.unshift(tmp[i])
          }
        }, err => {
          console.log(err);
        });
    },2000)
  }


  extractProcess(){
    this.stagelog ="Commiting extraction!";
    this.loading = true;
    this.refreshBtns()
    this.api.extract()
      .subscribe(res => {
        console.log(res);
        this.loading = false;
        this.stagelog ="";
        this.stage = "transform"
        this.refreshBtns()
      }, err => {
        console.log(err);
      });

  }
  transformProcess(){
    this.stagelog ="Don't think is nothing!";
    this.loading = true;
    this.refreshBtns();
    setTimeout(()=>{
      this.api.transform()
        .subscribe(res => {
          console.log(res);
          this.loading = false;
          this.stagelog ="";
          this.stage = "load"
          this.refreshBtns()
        }, err => {
          console.log(err);
        });
    },500)
  }
  loadProcess(){
    this.stagelog ="Loading!";
    this.loading = true;
    this.refreshBtns()
    setTimeout(()=>{
      this.api.load('load')
        .subscribe(res => {
          console.log(res);
          this.loading = false;
          this.stagelog ="";
          this.stage = "extract"
          this.refreshBtns()
        }, err => {
          console.log(err);
        });
    },500)

  }


  refreshBtns(){
    this.buttonDis[0] = (this.stage !== "extract" || this.loading)
    this.buttonDis[1] = (this.stage !== "transform" || this.loading)
    this.buttonDis[2] = (this.stage !== "load" || this.loading)
  }

}
