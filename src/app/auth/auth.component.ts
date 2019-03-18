import { fadeIn } from './../shared/fade-in.animation';
import { AuthService } from './auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [fadeIn]
})
export class AuthComponent  implements OnInit {

  url = environment.url + 'git';
  tabIndex = 0;
  login = false;
  message: string;
  showLoginSub: Subscription;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private authService: AuthService) {}

  onCloseLogin() {
    this.authService.getLoginSub().next({ status: false });
  }

  onSignup() {
    console.log('entered');
    if (this.signupForm.valid && this.signupForm.value.password === this.signupForm.value.confirmPassword) {
      delete this.signupForm.value.confirmPassword;
      console.log('deleted');
      this.authService.createAccount(this.signupForm.value);
      console.log('sent');
    }
  }

  onLogin() {
    if (this.signupForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }

  ngOnInit() {
    this.showLoginSub = this.authService.getLoginSub().subscribe(response => {
      this.login = response.status;
      this.tabIndex = response.index;
      this.message = response.message;
    });
    this.signupForm = new FormGroup({
      name: new FormControl(null),
      email: new FormControl(null),
      password: new FormControl(null),
      confirmPassword: new FormControl(null)
    });
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null)
    });
  }
}
