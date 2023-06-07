import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  providers: [ AuthenticationService ]
})
export class HomepageComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  errorMessage = '';
  constructor(public auth: AuthenticationService) { }

  ngOnInit(): void {
  }

  onSubmit(type: any) {
    if (type ==='login'){
      this.login();
    }
    if (type === 'register') {
      this.register();
    }
  }
  register() {
    this.auth.register(this.form.email,this.form.password,this.form.username);
  }

  login() {
    this.auth.login(this.form.email,this.form.password);
  }
  googleLogin() {
    this.auth.googleLogin();
  }
  logout() {
    this.auth.logout();
  }
}
