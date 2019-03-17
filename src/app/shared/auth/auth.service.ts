import { User } from './../user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment as env } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Injectable({providedIn: 'root'})
export class AuthService {

  private user: User;
  private isAuthenticated = false;
  private token: string;
  private showLoginSub = new Subject<{status: boolean, index?: number}>();
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog) {}

  getLoginSub() {
    return this.showLoginSub;
  }

  get IsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createAccount(body) {
    this.http.post<{user: User, token: string, error: string}>(env.url + 'users/signup', body)
     .subscribe( response => {
       if (response.error) {
        this.dialog.open(DialogComponent, {data:
          {result: 'Failed', message: response.error}});
        return;
       }
       this.user = response.user;
       this.isAuthenticated = true;
       this.saveAuthData(response.token);
       this.showLoginSub.next({status: false});
       this.authStatusListener.next(true);
     });
  }

  login(body) {
    console.log(body);
    this.http.post<{user: User, token: string}>(env.url + 'users/login', body)
     .subscribe( response => {
        this.user = response.user;
        this.isAuthenticated = true;
        this.saveAuthData(response.token);
        this.showLoginSub.next({status: false});
        this.authStatusListener.next(true);
     }, (error) => {
       console.log(error);
      this.dialog.open(DialogComponent, {data:
        {result: 'Failed', message: error.error}});
     });
  }

  logout() {
    this.clearAuthData();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  saveAuthData(token) {
    this.token = token;
    localStorage.setItem('vsa_token', token);
    localStorage.setItem('vsa_id', this.user._id);
    localStorage.setItem('vsa_username', this.user.name);
    localStorage.setItem('vsa_email', this.user.email);
    localStorage.setItem('vsa_authId', String(this.user.authId));
  }

  autoAuth() {
    const authObj: User = {
      _id : localStorage.getItem('vsa_id'),
      name : localStorage.getItem('vsa_username'),
      email : localStorage.getItem('vsa_email'),
      authId : +localStorage.getItem('vsa_authId')
    };
    this.token = localStorage.getItem('vsa_token');

    if (Object.values(authObj).indexOf(undefined && null) !== -1 || !this.token) {
      return this.router.navigate(['/']);
    }
    this.user = authObj;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    console.log('auto auth worked', this.user);
  }

  clearAuthData() {
    localStorage.removeItem('vsa_token');
    localStorage.removeItem('vsa_id');
    localStorage.removeItem('vsa_username');
    localStorage.removeItem('vsa_email');
    localStorage.removeItem('vsa_authId');
  }
}
