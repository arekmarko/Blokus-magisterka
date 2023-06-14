import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SHAPES } from 'src/app/constants';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  username: any;
  gamesPlayed: any;
  wins: any;
  zeroPieces: any;
  leftPieces: any;
  leastUsed: any;
  beginsWith: any;
  leastUsedValue: any;
  beginsWithValue: any;
  avgPieces: any;
  winsBackground: any;
  zeroPiecesBackground: any;
  leftPiecesGamesPlayedBackground: any;
  
  constructor(private route: ActivatedRoute, private socketIoService: SocketioService, private router: Router) { }

  ngOnInit(): void {
    try {
      this.username = this.route.snapshot.paramMap.get('id');
      this.socketIoService.getStats(this.username).subscribe((message: any) => {
        console.log(message);
        this.gamesPlayed = message.gamesPlayed;
        this.wins = message.wins;
        this.zeroPieces = message.zeroPieces;
        this.leftPieces = message.leftPieces;
        this.leastUsed = SHAPES[message.leastUsed].slice();
        this.beginsWith = SHAPES[message.beginsWith].slice();
        this.leastUsedValue = message.leastUsedValue;
        this.beginsWithValue = message.beginsWithValue;
        this.avgPieces = (message.leftPieces/message.gamesPlayed).toFixed(2);
        if (this.gamesPlayed==0){
            this.winsBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc( 0*100%), green 0)';
            this.leftPiecesGamesPlayedBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc(0/89*100%), green 0)';
            this.zeroPiecesBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc( 0 *100%), green 0)';
          } else {
            this.winsBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc( ( ' + this.wins + ' / ' + this.gamesPlayed + ' )*100%), green 0)';
            this.leftPiecesGamesPlayedBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc((89 - (' + this.leftPieces + '/' + this.gamesPlayed + '))/89*100%), green 0)';
            this.zeroPiecesBackground = 'radial-gradient(closest-side, #333 77%, transparent 80% 100%),conic-gradient(chartreuse calc( ' + this.zeroPieces + ' / ' + this.gamesPlayed + ' *100%), green 0)';
          }
      });
    } catch {
      this.router.navigate(['/']);
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
}
