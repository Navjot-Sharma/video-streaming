import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { Component, OnInit, OnDestroy,  } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  isAuthenticated = false;
  authSub: Subscription;
  showLogin = false;

  constructor(private authService: AuthService) {}

  onLoginShow() {
    this.authService.getLoginSub().next({status: true, index: 0});
  }
  onSignupShow() {
    this.authService.getLoginSub().next({status: true, index: 1});
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.IsAuthenticated;
    this.authSub = this.authService.getAuthStatusListener()
     .subscribe( response => this.isAuthenticated = response);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
