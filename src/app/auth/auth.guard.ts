import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({'providedIn': 'root'})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}
  canActivate() {
    const isAuth = this.authService.IsAuthenticated;

    if (!isAuth) {
      this.router.navigate(['/']);
    }
    return isAuth;
  }
}

