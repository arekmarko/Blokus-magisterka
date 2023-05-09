import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS, SHAPES } from 'src/app/constants';
import { Piece } from '../piece/piece.component';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // @ViewChild('board', { static: true })
  // canvas!: ElementRef<HTMLCanvasElement>;

  ctx: any;
  piece!: Piece;
  points: any;
  lines: any;
  level: any;
  board!: number[][];
  isDragging: boolean = false;
  SHAPE: any = SHAPES[4];
  shaps: any = SHAPES;
  

  constructor() { }

  ngOnInit(): void {
    //this.initBoard();
    this.play();
  }

  // initBoard() {
  //   this.ctx = this.canvas.nativeElement.getContext('2d');
  //   this.ctx.canvas.width = BLOCK_SIZE * ROWS;
  //   this.ctx.canvas.height = BLOCK_SIZE * COLS;
  //   this.ctx.scale(BLOCK_SIZE,BLOCK_SIZE);
  //   this.canvas.nativeElement.addEventListener('click', (event: MouseEvent) => {
  //     //if (event.clientX > 3 * BLOCK_SIZE && event.clientX < 4 * BLOCK_SIZE)
  //     if (this.board[Math.floor(event.clientY/30)][Math.floor(event.clientX/30)] === 1) {
  //       this.board[Math.floor(event.clientY/30)][Math.floor(event.clientX/30)] = 0;
  //       this.drawBoard();
  //       console.log(this.board[Math.floor(event.clientY/30)][Math.floor(event.clientX/30)]);  
  //     }
  //     console.log(Math.floor(event.clientY/30) + " " + Math.floor(event.clientX/30));
  //   });
  // }

  getEmptyBoard(): number[][] {
    return Array.from({length:ROWS}, () =>
    Array(COLS).fill(0));
  }

  play() {
    this.board = this.getEmptyBoard();
    // this.piece = new Piece(this.ctx);
    // for (let shapeID in SHAPES){
    //   this.piece.updateBoard(this.board, shapeID);
    //   this.piece.draw(shapeID);
    // }
    console.table(this.board);
    console.log(this.shaps);
  }
  
  drawBoard() {
    this.board.forEach((row,y) => {
      row.forEach((value,x) => {
        if (value > 0) {
          this.ctx.fillStyle = 'blue';
          this.ctx.fillRect(x, y, 1, 1);
        } else {
          this.ctx.fillStyle = '#111';
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }
  
}
