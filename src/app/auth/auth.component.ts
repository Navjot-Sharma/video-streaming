import { fadeIn } from './../shared/fade-in.animation';
import { AuthService } from './auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from './../../environments/environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [fadeIn]
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoading = false;
  url = environment.url + 'git';
  tabIndex: number;
  login = false;
  message: string;
  signupMessage: {show: false, message: ''};
  showLoginSub: Subscription;
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(private authService: AuthService) {}

  onCloseLogin() {
    this.authService.getLoginSub().next({ status: false });
  }

  onSignup() {
    if (this.signupform.value.password !== this.signupForm.value.confirmPassword) {
      this.signupMessage.message = `Password and confirm password didn't match`;
      return this.signupMessage.show = true;
    }
    if (this.signupForm.valid) {
      delete this.signupForm.value.confirmPassword;
      this.authService.createAccount(this.signupForm.value);
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }

  ngOnInit() {
    this.tabIndex = this.authService.tabIndex;

    this.showLoginSub = this.authService.getLoginSub().subscribe(response => {
      this.login = response.status;
      this.message = response.message;
    });

    this.signupForm = new FormGroup({
      name: new FormControl(null, { validators: Validators.required }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, { validators: Validators.required }),
      confirmPassword: new FormControl(null, {
        validators: Validators.required
      })
    });

    this.loginForm = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, { validators: Validators.required })
    });
  }
  ngOnDestroy() {
    this.showLoginSub.unsubscribe();
  }
}
