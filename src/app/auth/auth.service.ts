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
  private showLoginSub = new Subject<{status: boolean, message?: string}>();
  private authStatusListener = new Subject<boolean>();
  private userSub = new Subject<User>();

  public tabIndex: number;

  constructor(private http: HttpClient,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {}


  get User() {
    return this.user;
  }
  getUserSub() {
    return this.userSub.asObservable();
  }

  getToken() {
    return this.token;
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
     }, error => {
       console.log(error.error.error);
       this.showLoginSub.next({status: true, message: error.error.error});
      });
  }

  login(body) {
    this.http.post<{user: User, token: string}>(env.url + 'users/login', body)
     .subscribe( response => {
        this.user = response.user;
        this.isAuthenticated = true;
        this.saveAuthData(response.token);
        this.showLoginSub.next({status: false});
        this.authStatusListener.next(true);
        this.showSnackBar('You have been logged in', 'Ok');
     }, (error) => {
        this.showLoginSub.next({status: true, message: error.error});
     });
  }

  updateAccount(body) {
    this.http.put<{user: User, token: string}>(env.url + 'users', body)
     .subscribe( response => {
      this.user = response.user;
      this.saveAuthData(response.token);
      this.userSub.next(this.user);
      this.showSnackBar('Your account has been updated', 'Ok');
   }, (error) => {
     this.dialog.open(DialogComponent, {data: {result: 'Failed', message: 'Update failed'}});
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
        this.showSnackBar('You have been logged out', 'Ok');
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
      this.clearAuthData();
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      return this.router.navigate(['/']);
    }
    this.user = authObj;
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
  }

  clearAuthData() {
    localStorage.removeItem('vsa_token');
    localStorage.removeItem('vsa_id');
    localStorage.removeItem('vsa_username');
    localStorage.removeItem('vsa_email');
    localStorage.removeItem('vsa_authId');
  }

  showSnackBar(message: string, action: string, timing?: number) {
    this.snackBar.open(message, action, {duration: timing || 2000});
  }
}
