import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { fadeIn } from '../shared/fade-in.animation';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css'],
  animations: [fadeIn]
})
export class StreamComponent implements OnInit {
  tabIndex = 1;
  login = false;
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
