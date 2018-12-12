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
  MatStepperModule,
  MatButtonToggleModule,
  MatCardModule,
  MatFormFieldModule } from '@angular/material';
import { EtlPageComponent } from './etl-page/etl-page.component';
import { ConsoleComponent } from './etl-page/console/console.component';
import { LineComponent } from './etl-page/console/line/line.component';

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
    EtlPageComponent,
    ConsoleComponent,
    LineComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes, {useHash:true}),
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonToggleModule,
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
