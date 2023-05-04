import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  gameId: any;

  constructor(private socketIoService: SocketioService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.receiveJoinedPlayers();
  }

  receiveJoinedPlayers() {
    this.socketIoService.receiveJoinedPlayers().subscribe((message) => {
      console.log(message);
    });
  }
}
