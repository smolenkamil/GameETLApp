import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  games: any;

  displayedColumns = ['title', 'category', 'producer', 'publisher'];
  dataSource = new GameDataSource(this.api);

  constructor(private api: ApiService) { }

  ngOnInit() {
    setTimeout(()=>{
      this.api.getGames()
        .subscribe(res => {
          console.log(res);
          this.games = res;
        }, err => {
          console.log(err);
        });
    },500)
  }

}

export class GameDataSource extends DataSource<any> {
  constructor(private api: ApiService) {
    super();
  }

  connect() {
    return this.api.getGames();
  }

  disconnect() {

  }
}
