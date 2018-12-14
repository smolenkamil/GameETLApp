import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  game = {};

  constructor(private route: ActivatedRoute, private api: ApiService,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getGameDetails(this.route.snapshot.params['id']);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getGameDetails(id) {
    setTimeout(()=>{
      this.api.getGame(id)
        .subscribe(data => {
          console.log(data);
          this.game = data;
        });
    },500)
  }
  exportToFile(){
      this.api.export('game/'+this.route.snapshot.params['id'])
        .subscribe(res => {
          console.log(res);
          this.openSnackBar("Game succesfully exported!",'./export/game'+this.route.snapshot.params['id']+'.txt')
        }, err => {
          console.log(err);
        });
  }

}
