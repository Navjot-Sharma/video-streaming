import { PlaylistService } from './shared/playlist.service';
import { AuthService } from './auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  overlay = false;
  showLoginSub: Subscription;
  title = 'video-streaming';

  constructor(private authService: AuthService,
              private playlistService: PlaylistService) {}

  onOverlayClick() {
    this.authService.getLoginSub().next({status: false});
  }

  ngOnInit() {
    this.authService.autoAuth();
    this.showLoginSub = this.authService.getLoginSub()
     .subscribe( response => this.overlay = response.status);
     if (this.authService.IsAuthenticated) {
       this.playlistService.fetchPlaylists();
     }
  }
}
