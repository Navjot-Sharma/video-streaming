import { User } from '../shared/user.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment as env } from '../../environments/environment';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({providedIn: 'root'})
export class AuthService {

  private user: User;
  private isAuthenticated = false;
  private token: string;
  private showLoginSub = new Subject<{status: boolean, index?: number, message?: string}>();
  private authStatusListener = new Subject<boolean>();
  private userSub = new Subject<User>();

  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog,
              private snackbar: MatSnackBar) {}


  get User() {
    return this.user;
  }
  getUserSub() {
    return this.userSub.asObservable();
  }

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
       this.user = response.user;
       this.isAuthenticated = true;
       this.saveAuthData(response.token);
       this.showLoginSub.next({status: false});
       this.authStatusListener.next(true);
     }, error => this.showLoginSub.next({status: true, message: error.error}));
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
        this.snackbar.open('You have been logged in', 'Ok', {duration: 2000});
     }, (error) => {
       console.log(error.error);
        this.showLoginSub.next({status: true, message: error.error});
     });
  }

  updateAccount(body) {
    this.http.put<{user: User, token: string}>(env.url + 'users/' + this.user._id, body)
     .subscribe( response => {
      this.user = response.user;
      this.saveAuthData(response.token);
      this.userSub.next(this.user);
      this.snackbar.open('Your account has been updated', 'Ok', {duration: 2000});
   }, (error) => {
     console.log(error.error);
      this.showLoginSub.next({status: true, message: error.error});
   });
  }

  logout() {
    const dialogRef = this.dialog.open(DialogComponent, {data: {result: 'Confirm?', message: 'Are you sure?'}});
    dialogRef.afterClosed().subscribe( response => {
      if (response) {
        this.clearAuthData();
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
        this.snackbar.open('You have been logged out', 'Ok', {duration: 2000});
      }
    });
  }



  // local storage data manipulations
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
