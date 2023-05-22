import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BLOCK_SIZE, COLS, ROWS, SHAPES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  gameId: any;
  room: any;
  name: any;
  board!: number[][];
  tmpBoard!: number[][];
  isDragging: boolean = false;
  selectedShape!: number[][];
  coords: number[] = [0, 0];
  shaps: any = SHAPES;
  canPlaceDown: boolean = false;
  round: number = 1;
  currentPlayer: any;
  currentPlayerIndex: any;

  constructor(private socketIoService: SocketioService, private route: ActivatedRoute, private auth: AuthenticationService) { }

  ngOnInit(): void {
    this.play();
    this.auth.auth.authState.subscribe(() => {
      this.name = this.auth.name;
      this.receiveJoinedPlayers();
      this.socketIoService.gameStarted(this.gameId, this.board);
      this.socketIoService.watchBoard().subscribe((message: any) =>{
        this.board = message.board;
        this.currentPlayer = message.player;
        this.currentPlayerIndex = message.playerIndex;
        this.round = message.round;
      });
    });
  }
  receiveJoinedPlayers() {
    this.socketIoService.receiveJoinedPlayers(this.gameId).subscribe((message: any) => {
      this.room = message;
    });
  }
  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0));
  }

  play() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.board = this.getEmptyBoard();
    this.tmpBoard = this.getEmptyBoard();
  }


  selectShape(s: any, x: any, y: any) {
    this.isDragging = true;
    this.selectedShape = s;
    this.coords[0] = x;
    this.coords[1] = y;
  }
  check(x: any, y: any) {
    if (this.isDragging) {
      let tmpCanPlaceDown = true;
      let tmpCanConnect = false;
      this.tmpBoard = this.getEmptyBoard();
      this.selectedShape.forEach((xshape: any, xindex) => {
        xshape.forEach((yshape: any, yindex: any) => {
          if (this.selectedShape[xindex][yindex] > 0) {
            if (this.isOutOfBound(x + xindex - this.coords[0], y + yindex - this.coords[1])){
              tmpCanPlaceDown = false;
            } 
            else if (this.isOverlaping(x + xindex - this.coords[0], y + yindex - this.coords[1])){
              tmpCanPlaceDown = false;
            }
            else if (this.isEdging(x + xindex - this.coords[0], y + yindex - this.coords[1])){
              tmpCanPlaceDown = false;
            } 
            if (this.canConnect(x + xindex - this.coords[0], y + yindex - this.coords[1])){
              tmpCanConnect = true;
            }
          }
        });
      });
      if (tmpCanPlaceDown && tmpCanConnect && this.name==this.currentPlayer){
        this.canPlaceDown = true;
      } else {
        this.canPlaceDown = false;
      }
    }
  }
  isOutOfBound(x: number, y: number) {
    if ((x > 19) || (y > 19) || (x < 0) || (y < 0)){
      console.log('Piece is out of bounds');
      return true;
    }
    this.tmpBoard[x][y] = this.currentPlayerIndex+1;
    return false;
  }
  isOverlaping(x: any, y: number) {
    if (this.board[x][y] > 0){
      console.log('is overlaping');
      return true;
    }
    return false;
  }
  isEdging(x: any, y: any){
    if (x-1 >= 0){
      if (this.board[x-1][y] == this.currentPlayerIndex+1) {
        console.log('piece is edgeing');
        return true;
      }
    }
    if (x+1 < 20){
      if (this.board[x+1][y] == this.currentPlayerIndex+1){
        console.log('piece is edgeing');
        return true;
      }
    }
    if (y-1 >= 0){
      if (this.board[x][y-1] == this.currentPlayerIndex+1){
        console.log('piece is edgeing');
        return true;
      }
    }
    if (y+1 < 20){
      if (this.board[x][y+1] == this.currentPlayerIndex+1){
        console.log('piece is edgeing');
        return true;
      } 
    }
    return false;
  }
  canConnect(x: any, y: any) {
    if (this.round==1){
      if ((x==0 && y==0 && this.currentPlayerIndex==0) || (x==19 && y==19 && this.currentPlayerIndex==2) || (x==0 && y==19 && this.currentPlayerIndex==3) || (x==19 && y==0 && this.currentPlayerIndex==1)){
        return true;
      }
    } 
    if (x-1 >= 0 && y-1 >= 0){
      if (this.board[x-1][y-1] == this.currentPlayerIndex+1) {
        console.log('can connect');
        return true;
      }
    }
    if (x-1 >= 0 && y+1 < 20){
      if (this.board[x-1][y+1] == this.currentPlayerIndex+1) {
        console.log('can connect');
        return true;
      }
    }
    if (x+1 < 20 && y-1 >= 0){
      if (this.board[x+1][y-1] == this.currentPlayerIndex+1){
        console.log('can connect');
        return true;
      }
    }
    if (x+1 < 20 && y+1 < 20){
      if (this.board[x+1][y+1] == this.currentPlayerIndex+1){
        console.log('can connect');
        return true;
      }
    }
    return false;
  }
  rotateLeft(matrix: any) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        let k = matrix[i][j];
        matrix[i][j] = matrix[j][y - i];
        matrix[j][y - i] = matrix[y - i][y - j];
        matrix[y - i][y - j] = matrix[y - j][i];
        matrix[y - j][i] = k;
      }
    }
    console.log(x);
    console.log(this.coords);
    let tmpX = this.coords[0];
    let tmpY = this.coords[1];
    this.coords[0] = y-tmpY;
    this.coords[1] = y-tmpX;
    console.log(this.coords);
  }

  rotateRight(matrix: any) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
      for (let j = i; j < y - i; j++) {
        let k = matrix[i][j];
        matrix[i][j] = matrix[y - j][i];
        matrix[y - j][i] = matrix[y - i][y - j];
        matrix[y - i][y - j] = matrix[j][y - i]
        matrix[j][y - i] = k
      }
    }
    
  }

  cancelRound() {
    if (this.name==this.currentPlayer){
      this.selectedShape = [];
      this.socketIoService.placeDown(this.gameId, this.board);
    }
  }

  placeDown(x:any,y:any) {
    if (this.canPlaceDown) {
      this.selectedShape.forEach((xshape: any, xindex) => {
        xshape.forEach((yshape: any, yindex: any) => {
          if (yshape > 0) {
            this.board[x + xindex - this.coords[0]][y + yindex - this.coords[1]] = this.currentPlayerIndex+1;
          }
        });
      });
      let index = this.shaps.findIndex((s:any) => 
        s === this.selectedShape
      );
      this.shaps.splice(index,1);
      this.selectedShape = [];
      this.socketIoService.placeDown(this.gameId, this.board);
    } else {
      console.log("You can't place it here");
    }
  }
}
