import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  games: any;

  displayedColumns = ['title', 'category', 'producer', 'publisher'];
  dataSource = new GameDataSource(this.api);

  constructor(private api: ApiService,public snackBar: MatSnackBar) { }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }


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
  exportToFile(){
    this.api.export('all')
      .subscribe(res => {
        console.log(res);
        this.openSnackBar("Games succesfully exported!",'./export/games.csv')
        this.exportComments()
      }, err => {
        console.log(err);
      });


  }

  exportComments(){
    this.api.export('comments')
      .subscribe(res => {
        console.log(res);
        this.openSnackBar("Comments succesfully exported!",'./export/comments.csv')
      }, err => {
        console.log(err);
      });

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
