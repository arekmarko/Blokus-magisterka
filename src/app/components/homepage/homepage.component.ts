import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { Socket } from 'socket.io-client';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { SocketioService } from 'src/app/services/socketio.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [ AuthenticationService ]
})
export class HomepageComponent implements OnInit {
  registerForm: any = {
    username: null,
    email: null,
    password: null
  };
  loginForm: any = {
    email: null,
    password: null
  };
  errorMessage = '';
  username = '';
  constructor( private router: Router, public auth: AuthenticationService, private socketIoService: SocketioService) { }

  ngOnInit(): void {
    this.auth.auth.authState.subscribe(() => {
      this.username = this.auth.name;
      this.socketIoService.connect(this.username);
    });
  }

  onRegister() {
    this.register();
  }
  onLogin(){
    this.login();
  }
  register() {
    this.auth.register(this.registerForm.email,this.registerForm.password,this.registerForm.username);
  }

  login() {
    this.auth.login(this.loginForm.email,this.loginForm.password);
  }
  googleLogin() {
    this.auth.googleLogin();
  }
  logout() {
    this.auth.logout();
  }
  getLetter(name: any) {
    return name[0].toUpperCase();
  }
  play() {
    if (this.username != null) {
      this.router.navigate(["/select-room"]);
    } else {
      console.log('zaloguj sie');
    }
  }
}
