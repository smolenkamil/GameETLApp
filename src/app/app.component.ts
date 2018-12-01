import { Component } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {current} from 'codelyzer/util/syntaxKind';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gameETL';

  currentUrl: string = '/etl'
  currentTitle: string = "Hello From The Other Side!"

  constructor(private router: Router){
    this.router.events.subscribe((e)=> {
      if(e instanceof NavigationEnd){
        this.currentUrl = e.url
        switch (this.currentUrl){
          case '':
          case '/':
          case '/etl': this.currentTitle = "Extract, Transform & Load Process Console"; break;
          case '/games': this.currentTitle = "Game List Table"; break;
          default: this.currentTitle = "Game Detail"; break;
        }
      }
    })
  }

}
