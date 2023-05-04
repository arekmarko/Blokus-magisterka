import { Component, OnInit } from '@angular/core';
import { SHAPES } from 'src/app/constants';

export interface IPiece {
  x: number;
  y: number;
  color: string;
  shape: number[][];
}

export class Piece implements IPiece {
  x: number = 0;
  y: number = 0;
  color: string = '';
  shape: number[][] = new Array; 
  int: number = 0;


  constructor(private ctx: CanvasRenderingContext2D) {
    this.spawn();
   }

  spawn() {
    this.color = 'blue';
    this.shape = SHAPES[this.int];

    //this.x = 0;
    //this.y = 0;
  }
  
  draw(shapeID: string) {
    this.ctx.fillStyle = this.color;
    SHAPES[parseInt(shapeID)].forEach((row,y) => {
      row.forEach((value,x) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
    //this.int++;
    this.y += 4;
    //this.spawn();
  }
  
  updateBoard(board: number[][], shapeID: string) {
    SHAPES[parseInt(shapeID)].forEach((row,y) => {
      row.forEach((value,x) => {
        if (value > 0) {
          board[this.y + y][this.x + x] = 1;
        }
      });
    });
  }
}
