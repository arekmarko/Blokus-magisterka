import { ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLOCK_SIZE, COLS, ROWS, SHAPES } from 'src/app/constants';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  gameId: any;
  players: any;
  room: any;
  name: any;
  myIndex: any;
  playing: any;
  board!: number[][];
  tmpBoard!: number[][];
  isDragging: boolean = false;
  //selectedShape!: number[][];
  selectedShape = [[1,1], [1,1]];
  xy: number[] = [0,0];
  coords: number[] = [0, 0];
  shaps: any;
  canPlaceDown: boolean = false;
  round: number = 1;
  currentPlayer: any;
  currentPlayerIndex: any;
  countSmallPieces = 89;
  leftPieces: any;
  standings = [0,1,2,3];
  colors = ['#5af', '#e33', '#8fa', '#ffa'];

  constructor(private socketIoService: SocketioService, private route: ActivatedRoute, private auth: AuthenticationService, private router: Router) { }

  @HostBinding("style.--playerColor") playerColor: string = '#888';

  ngOnInit(): void {
    this.play();
    this.auth.auth.authState.subscribe(() => {
      this.name = this.auth.name;
      this.receiveJoinedPlayers();
      this.socketIoService.gameStarted(this.gameId, this.board);
      this.socketIoService.watchBoard().subscribe((message: any) =>{
        this.board = message.board;
        this.players = message.players;
        this.players.forEach((p:any, index: any) => {
          if (p==this.name) {
            this.myIndex = index;
            this.playerColor = this.colors[index];
          }
        })
        this.currentPlayer = message.players[message.playerIndex];
        this.currentPlayerIndex = message.playerIndex;
        this.round = message.round;
        this.leftPieces = message.leftPieces;
        this.playing = message.playing;
        this.check(this.xy[0],this.xy[1]);
        this.sortPlayers();
      });
      this.socketIoService.isStarting().subscribe(() => {
        this.play();
        this.router.navigate(['/game', this.gameId]);
      });
      this.socketIoService.leavingGame().subscribe(() => {
        this.router.navigate(['/']);
      });
    });
  }

  ngOnDestroy(): void {
      
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
  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0));
  }

  play() {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.board = this.getEmptyBoard();
    this.tmpBoard = this.getEmptyBoard();
    this.shaps = SHAPES.slice();
    this.countSmallPieces=89;
  }

  surrender() {
    this.socketIoService.surrender(this.gameId, this.myIndex);
  }

  endGame() {
    let r = false;
    this.playing.forEach((e: any) => {
      if (e==true){
        r = true;
      }
    });
    return r;
  }

  leaveGame(){
    this.socketIoService.leaveGame(this.gameId);
  }

  sortPlayers() {
    var test = this.leftPieces.slice();
    var len = test.length;
    var indices = this.standings;
    for (var i = 0; i < len; i++){
      indices[i] = i;
    }
    indices.sort(function (a,b) {
      return test[a] < test[b] ? -1 : test[a] > test[b] ? 1 : 0;
    });
  }

  playAgain() {
    this.socketIoService.startGame(this.gameId);
  }


  selectShape(s: any, x: any, y: any) {
    if (s[x][y] > 0) {
      this.isDragging = true;
      this.selectedShape = s;
      this.coords[0] = x;
      this.coords[1] = y;
    }
  }
  check(x: any, y: any) {
    this.xy[0] = x;
    this.xy[1] = y;
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
      //console.log('Piece is out of bounds');
      return true;
    }
    this.tmpBoard[x][y] = this.currentPlayerIndex+1;
    return false;
  }
  isOverlaping(x: any, y: number) {
    if (this.board[x][y] > 0){
      //console.log('is overlaping');
      return true;
    }
    return false;
  }
  isEdging(x: any, y: any){
    if (x-1 >= 0){
      if (this.board[x-1][y] == this.currentPlayerIndex+1) {
        //console.log('piece is edgeing');
        return true;
      }
    }
    if (x+1 < 20){
      if (this.board[x+1][y] == this.currentPlayerIndex+1){
        //console.log('piece is edgeing');
        return true;
      }
    }
    if (y-1 >= 0){
      if (this.board[x][y-1] == this.currentPlayerIndex+1){
        //console.log('piece is edgeing');
        return true;
      }
    }
    if (y+1 < 20){
      if (this.board[x][y+1] == this.currentPlayerIndex+1){
        //console.log('piece is edgeing');
        return true;
      } 
    }
    return false;
  }
  canConnect(x: any, y: any) {
    if ((x==0 && y==0 && this.currentPlayerIndex==0) || (x==19 && y==19 && this.currentPlayerIndex==2) || (x==0 && y==19 && this.currentPlayerIndex==3) || (x==19 && y==0 && this.currentPlayerIndex==1)){
      return true;
    }
    if (x-1 >= 0 && y-1 >= 0){
      if (this.board[x-1][y-1] == this.currentPlayerIndex+1) {
        //console.log('can connect');
        return true;
      }
    }
    if (x-1 >= 0 && y+1 < 20){
      if (this.board[x-1][y+1] == this.currentPlayerIndex+1) {
        //console.log('can connect');
        return true;
      }
    }
    if (x+1 < 20 && y-1 >= 0){
      if (this.board[x+1][y-1] == this.currentPlayerIndex+1){
        //console.log('can connect');
        return true;
      }
    }
    if (x+1 < 20 && y+1 < 20){
      if (this.board[x+1][y+1] == this.currentPlayerIndex+1){
        //console.log('can connect');
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
    let tmpX = this.coords[0];
    let tmpY = this.coords[1];
    this.coords[0] = y-tmpY;
    this.coords[1] = tmpX;
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
    let tmpX = this.coords[0];
    let tmpY = this.coords[1];
    this.coords[0] = tmpY;
    this.coords[1] = y-tmpX;
  }

  mirrorHorizontal(matrix: any) {
    this.rotateLeft(matrix);
    this.coords[1] = (matrix.length - 1) - this.coords[1];
    matrix.map(function(arr: any){return arr.reverse();});
    this.rotateRight(matrix);
  }
  
  mirrorVertical(matrix: any) {
    this.coords[1] = (matrix.length - 1) - this.coords[1];
    matrix.map(function(arr: any){return arr.reverse();});
  }

  cancelRound() {
    if (this.name==this.currentPlayer){
      this.selectedShape = [];
      this.socketIoService.placeDown(this.gameId, this.board, this.countSmallPieces, -1);
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
      let shapesIndex = SHAPES.findIndex((s: any) =>
        s === this.selectedShape
      );
      this.shaps.splice(index,1);
      this.selectedShape = [];
      this.countPieces();
      this.socketIoService.placeDown(this.gameId, this.board, this.countSmallPieces, shapesIndex);
      this.canPlaceDown = false;
      this.sortPlayers();
    } else {
      //console.log("You can't place it here");
    }
  }
  checkRow(x: any) {
    for (let i = 0; i < x.length; i++){
      if (x[i] > 0){
        return true;
      }
    }
    return false;
  }
  countPieces(){
    this.countSmallPieces = 0;
    this.shaps.forEach((e:any) => {
      e.forEach((x: any) => {
        x.forEach((y: any) => {
          if (y > 0){
            this.countSmallPieces++;
          }
        });
      });
    });
  }
}
