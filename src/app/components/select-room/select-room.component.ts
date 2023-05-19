import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketioService } from 'src/app/services/socketio.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
@Component({
  selector: 'app-select-room',
  templateUrl: './select-room.component.html',
  styleUrls: ['./select-room.component.css']
})
export class SelectRoomComponent implements OnInit {

  roomName: any;
  rooms: any;

  constructor(private socketIoService: SocketioService, private router: Router, public auth: AuthenticationService) { }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe(() => {
      this.socketIoService.connect(this.auth.name);
      this.receiveRoomsList();
    });
    
  }

  joinRoom(room: any) {
    console.log("joined " + room.roomName);
    this.socketIoService.joinGame(this.auth.name, room.gameId);
    this.router.navigate(['/lobby', room.gameId]);
  }
  
  createRoom() {
    const uuid = uuidv4();
    this.router.navigate(['/lobby', uuid]);
    this.socketIoService.create(uuid, this.roomName, this.auth.name);
  }
  receiveRoomsList() {
    this.socketIoService.getRooms().subscribe((message) => {
      this.rooms = message;
    })
  }
}
