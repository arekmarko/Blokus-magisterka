import { Injectable } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { from } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  
  name: any;
  currentUser$ = this.auth.user;
  user: any;

  constructor(public auth: AngularFireAuth) { 
    this.auth.authState.subscribe(user => {
      this.name = user?.displayName;
    });
    
  }
  
  register(email: string, password: string, username: string) {
    return from(this.auth.createUserWithEmailAndPassword(email,password)
    .then((result) => {
      result.user?.updateProfile({
        displayName: username
      })
    })
    );
  }

  login(email: string, password: string) {
    return from(this.auth.signInWithEmailAndPassword(email,password));
  }

  googleLogin() {
    return from(this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  logout() {
    return from(this.auth.signOut());
  }

  getName() {
    return this.auth.authState.subscribe(user => {
      return user?.displayName;
    });

    //return this.name;
  }
}
