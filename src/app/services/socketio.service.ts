import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

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
  joinGame(username: any, gameId: any){
    this.socket = io('localhost:3000');
    this.socket.emit('joinGame',{username: username, gameId: gameId})
  }
  create(gameId: any, roomName: any, username: any){
    this.socket = io('localhost:3000');
    this.socket.emit('createGame',{gameId: gameId, roomName: roomName, username: username})
  }
  getRooms(){
    return new Observable((observer) =>{
      this.socket.on('roomList', rooms => {
      observer.next(rooms);
    })
  })
  }
  receiveJoinedPlayers(gameId: any) {
    this.socket.emit('receiveJoinedPlayers',{gameId: gameId});
    return new Observable((observer) => {
      this.socket.on('joinedPlayers', (message) => {
        observer.next(message);
      })
    });
  }
  startGame(gameId: any) {
    this.socket.emit('startGame', {gameId: gameId});
  }
  isStarting() {
    return new Observable((observer) => {
      this.socket.on('start', (message) => {
        observer.next(message);
      })
    });
  }

  placeDown(gameId: any, board: any) {
    this.socket.emit('newBoard', {gameId: gameId, board: board});
  }
  watchBoard() {
    return new Observable((observer) => {
      this.socket.on('updateBoard', (message) => {
        observer.next(message);
      })
    });
  }
}
