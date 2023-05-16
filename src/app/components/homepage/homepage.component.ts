import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  
  constructor(public auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  googleLogin() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
