import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent implements OnInit {

  constructor(private socketIoService: SocketioService, private router: Router) { }

  ngOnInit(): void {
    this.socketIoService.connect("arkadiusz");
    this.socketIoService.getRooms();
  }

  joinRoom(name: string) {
   this.socketIoService.joinGame(name);
  }

  createRoom(username: string) {
    this.socketIoService.create(username);
    const uuid = uuidv4();
    this.router.navigate(['/lobby', uuid]);
  }
}
