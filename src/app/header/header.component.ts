import { Router, NavigationEnd } from '@angular/router';
import { PlaylistService } from './../shared/playlist.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuItem = { name: 'Settings', url: '/settings' };
  isAuthenticated = false;
  authSub: Subscription;
  showLogin = false;

  constructor(
    private authService: AuthService,
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  onLoginShow(id: number) {
    this.authService.tabIndex = id;
    this.authService.getLoginSub().next({ status: true });
  }
  onLogout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.IsAuthenticated;

    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe(response => {
        this.isAuthenticated = response;
        this.playlistService.fetchPlaylists();
      });

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((navEnd: NavigationEnd) => {
        if (navEnd.urlAfterRedirects.includes('settings')) {
          this.menuItem = { name: 'Home', url: '/' };
        } else {
          this.menuItem = { name: 'Settings', url: '/settings' };
        }
      });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
