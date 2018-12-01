import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-etl-page',
  templateUrl: './etl-page.component.html',
  styleUrls: ['./etl-page.component.css']
})
export class EtlPageComponent implements OnInit {

  constructor() { }

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
  }

  extractProcess(){
    this.stagelog ="Commiting extraction!";
    this.loading = true;
    this.refreshBtns()
    setTimeout(()=>{
      this.stagelog ="Brace Yourself!";
    }, 1000)
    setTimeout(()=>{
      this.loading = false;
      this.stagelog ="";
      this.stage = "transform"
      this.refreshBtns()
    }, 2000)
  }
  transformProcess(){
    this.stagelog ="Don't think is nothing!";
    this.loading = true;
    this.refreshBtns()
    setTimeout(()=>{
      this.stagelog ="Transformation becomes!";
    }, 1000)
    setTimeout(()=>{
      this.loading = false;
      this.stagelog ="";
      this.stage = "load"
      this.refreshBtns()
    }, 2000)
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
