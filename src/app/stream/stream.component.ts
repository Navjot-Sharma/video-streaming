import { PlaylistService } from './../shared/playlist.service';
import { environment } from './../../environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit {
  url = environment.url + 'git';
  login = false;
  showLoginSub: Subscription;

  constructor(private authService: AuthService,
              private playlistService: PlaylistService) {}

  onCloseLogin() {
    this.authService.getLoginSub().next({ status: false });
  }

  ngOnInit() {
    this.showLoginSub = this.authService.getLoginSub().subscribe(response => {
      this.login = response.status;
    });
    if (this.authService.IsAuthenticated) {
      this.playlistService.fetchPlaylists();
    }
  }
}
