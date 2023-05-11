import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BLOCK_SIZE, COLS, ROWS, SHAPES } from 'src/app/constants';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  board!: number[][];
  tmpBoard!: number[][];
  isDragging: boolean = false;
  selectedShape!: number[][];
  coords: number[] = [0, 0];
  shaps: any = SHAPES;


  constructor() { }

  ngOnInit(): void {
    this.play();
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () =>
      Array(COLS).fill(0));
  }

  play() {
    this.board = this.getEmptyBoard();
    this.tmpBoard = this.getEmptyBoard();
    //console.table(this.board);
    //console.log(this.shaps);
  }


  selectShape(s: any, x: any, y: any) {
    this.isDragging = true;
    this.selectedShape = s;
    this.coords[0] = x;
    this.coords[1] = y;
  }
  check(x: any, y: any) {
    if (this.isDragging) {
      //console.log(this.tmpBoard);
      this.tmpBoard = this.getEmptyBoard();
      //this.tmpBoard = this.board.map(elem => elem);
      this.selectedShape.forEach((xshape: any, xindex) => {
        xshape.forEach((yshape: any, yindex: any) => {
          this.tmpBoard[x + xindex - this.coords[0]][y + yindex - this.coords[1]] = yshape;
        });
      });
    }
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

  placeDown(x:any,y:any) {
    this.selectedShape.forEach((xshape: any, xindex) => {
      xshape.forEach((yshape: any, yindex: any) => {
        this.board[x + xindex - this.coords[0]][y + yindex - this.coords[1]] = yshape;
      });
    });
    this.selectedShape = [];
  }
}
