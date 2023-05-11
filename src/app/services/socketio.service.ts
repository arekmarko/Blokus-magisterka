import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket!: Socket;
  rooms: string[] = [];

  constructor() { }

  connect(username: string){
    this.socket = io('localhost:3000');
    this.socket.emit('send-username',{username: username})
  }
  joinGame(gameId: any){
    this.socket = io('localhost:3000');
    this.socket.emit('joinGame',{gameId: gameId})
  }
  create(username: any){
    this.socket = io('localhost:3000');
    this.socket.emit('createGame',{username: username})
  }
  getRooms(){
    this.socket.on('roomList', rooms => {
      this.rooms = Object.keys(rooms);
      console.log(this.rooms);
    })
  }
  receiveJoinedPlayers() {
    return new Observable((observer) => {
      this.socket.on('joinGame', (message) => {
        observer.next(message);
      })
    });
  }
}
