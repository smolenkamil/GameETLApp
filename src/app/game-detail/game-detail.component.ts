import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  game = {};

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit() {
    this.getGameDetails(this.route.snapshot.params['id']);
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


}
