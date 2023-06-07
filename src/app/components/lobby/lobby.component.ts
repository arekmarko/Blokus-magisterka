import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})

export class LobbyComponent implements OnInit, OnDestroy {
  gameId: any;
  room: any;
  username: any;

  constructor(private socketIoService: SocketioService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.receiveJoinedPlayers();
    this.start();
  }

  ngOnDestroy(): void {
    this.socketIoService.leaveRoom(this.gameId, this.username);
    console.log('onDestroy triggered');
  }

  receiveJoinedPlayers() {
    this.socketIoService.receiveJoinedPlayers(this.gameId).subscribe((message: any) => {
      this.room = message;
    });
  }

  start() {
    this.socketIoService.isStarting().subscribe(() => {
      this.router.navigate(['/game', this.gameId]);
    })
  }

  startGame() {
    this.socketIoService.startGame(this.gameId);
  }

  addBot() {
    this.socketIoService.addBot(this.gameId);
  }
}
