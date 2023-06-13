import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
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

  constructor(private socketIoService: SocketioService, private route: ActivatedRoute, private router: Router, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.receiveJoinedPlayers();
    this.start();
    this.auth.auth.authState.subscribe(() => {
      this.username = this.auth.name;
    });
  }

  ngOnDestroy(): void {
    try {
      this.socketIoService.leaveRoom(this.gameId, this.username);
    } catch {
      this.router.navigate(['/']);
    }
  }

  receiveJoinedPlayers() {
    try {
      this.socketIoService.receiveJoinedPlayers(this.gameId).subscribe((message: any) => {
        this.room = message;
      });
    } catch {
      this.router.navigate(['/']);
    }
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
  removeBot() {
    this.socketIoService.removeBot(this.gameId);
  }
  getLetter(name: any) {
    return name[0].toUpperCase();
  }
}
