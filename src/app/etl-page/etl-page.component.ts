import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

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
            console.log("ddd"+ i)
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

  test(){
    this.api.load('test')
      .subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
  }

  extractProcess(){
    this.stagelog ="Commiting extraction!";
    this.loading = true;
    this.refreshBtns()
    // setTimeout(()=>{
    //   this.stagelog ="Brace Yourself!";
    // }, 1000)
    // setTimeout(()=>{
    //   this.loading = false;
    //   this.stagelog ="";
    //   this.stage = "transform"
    //   this.refreshBtns()
    // }, 2000)
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
  }
  loadProcess(){
    this.stagelog ="Loading!";
    this.loading = true;
    this.refreshBtns()
    setTimeout(()=>{
      this.stagelog ="Fly, you fools!";
    }, 1000)
    setTimeout(()=>{
      this.loading = false;
      this.stagelog ="";
      this.stage = "extract"
      this.refreshBtns()
    }, 2000)
  }


  refreshBtns(){
    this.buttonDis[0] = (this.stage !== "extract" || this.loading)
    this.buttonDis[1] = (this.stage !== "transform" || this.loading)
    this.buttonDis[2] = (this.stage !== "load" || this.loading)
  }

}
