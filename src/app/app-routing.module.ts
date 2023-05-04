import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { SelectRoomComponent } from './components/select-room/select-room.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'lobby/:id', component: LobbyComponent},
  {path: 'select-room', component: SelectRoomComponent},
  {path: 'game', component:GameComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
