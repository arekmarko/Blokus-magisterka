import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SelectRoomComponent } from './components/select-room/select-room.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Modal,Offcanvas } from 'bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    GameComponent,
    HomepageComponent,
    SelectRoomComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgbModule,
    DragDropModule,
    
  ],
  providers: [],
  bootstrap: [
    AppComponent,
    Modal,
    Offcanvas,

  ]
})
export class AppModule { }
