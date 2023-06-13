import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket!: Socket;
  rooms: string[] = [];
  url1: string = 'localhost:8080';
  url2: string = '192.168.1.22:8080';
  url: string = 'https://magblokus.azurewebsites.net:443';

  constructor() { }

  connect(username: string){
    this.socket = io(this.url);
    this.socket.emit('send-username',{username: username})
  }
  joinGame(username: any, gameId: any){
    this.socket = io(this.url);
    this.socket.emit('joinGame',{username: username, gameId: gameId})
  }
  create(gameId: any, roomName: any, username: any){
    this.socket = io(this.url);
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
  gameStarted(gameId: any, board: any) {
    this.socket.emit('gameStarted', {gameId: gameId, board: board});
  }
  placeDown(gameId: any, board: any, smallPieces: any, pieceIndex: any) {
    this.socket.emit('newBoard', {gameId: gameId, board: board, smallPieces: smallPieces, pieceIndex: pieceIndex});
  }
  surrender(gameId: any, myIndex: any) {
    this.socket.emit('surrender', {gameId: gameId, myIndex: myIndex});
  }
  watchBoard() {
    return new Observable((observer) => {
      this.socket.on('updateBoard', (message) => {
        observer.next(message);
      })
    });
  }
  addBot(gameId: any) {
    this.socket.emit('addBot', {gameId: gameId});
  }
  removeBot(gameId: any) {
    this.socket.emit('removeBot', {gameId: gameId});
  }
  leaveRoom(gameId: any, username: any) {
    this.socket.emit('leaveRoom', {gameId: gameId, username: username});
  }
  leaveGame(gameId: any){
    this.socket.emit('leaveGame', {gameId: gameId});
  }
  leavingGame() {
    return new Observable((observer) => {
      this.socket.on('leaveGame', (message) => {
        observer.next(message);
      })
    });
  }
  getStats(username: any) {
    this.socket.emit('getStats', {username: username});
    return new Observable((observer) => {
      this.socket.on('getStats', (message) => {
        observer.next(message);
      })
    });
  }

}
