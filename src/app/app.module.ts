import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule } from '@angular/material';
import { TopTabComponent } from './items/top-tab/top-tab.component';
import { EtlPageComponent } from './etl-page/etl-page.component';

const appRoutes: Routes = [
  {
    path: 'etl',
    component: EtlPageComponent,
    data: { title: 'ETL Process' }
  },
  {
    path: 'games',
    component: GameComponent,
    data: { title: 'Games List' }
  },
  {
    path: 'game-details/:id',
    component: GameDetailComponent,
    data: { title: 'Game Details' }
  },
  { path: '',
    redirectTo: '/etl',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameDetailComponent,
    TopTabComponent,
    EtlPageComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {useHash:true}),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
