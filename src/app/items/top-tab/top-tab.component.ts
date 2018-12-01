import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-top-tab',
  templateUrl: './top-tab.component.html',
  styleUrls: ['./top-tab.component.css']
})
export class TopTabComponent implements OnInit {

  @Input('dt') data;

  constructor() { }

  ngOnInit() {
  }

}
