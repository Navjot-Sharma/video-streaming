import { Playlist } from './../shared/playlist.model';
import { PlaylistService } from './../shared/playlist.service';
import { environment } from './../../environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.css']
})
export class StreamComponent implements OnInit, OnDestroy {

  @ViewChild('video') video: ElementRef;
  isLoading = true;
  url: string;
  title: string;
  login = false;
  playlist: Playlist;
  playingVideo = 0;
  showLoginSub: Subscription;
  playVideoSub: Subscription;
  playlistsSub: Subscription;

  constructor(private authService: AuthService,
              private playlistService: PlaylistService) {}

  onCloseLogin() {
    this.authService.getLoginSub().next({ status: false });
  }
  onVideoEnd() {
    this.playingVideo++;
    if (this.playlist.videos.length > this.playingVideo) {
      const videoId = this.playlist.videos[this.playingVideo].videoId;
      const title = this.playlist.videos[this.playingVideo].title;
      this.playlistService.getPlayVideoSub().next({
        videoId, title, activePlaylist: this.playlist
      });
    }
  }

  ngOnInit() {
    this.isLoading = true;
    this.showLoginSub = this.authService.getLoginSub().subscribe(response => {
      this.login = response.status;
    });
    this.playlistService.fetchPlaylists();

    this.playlistsSub = this.playlistService.getPlaylistsSub().subscribe(response => {
      this.isLoading = true;
      if (response.length > 0 && response[0].videos.length > 0) {
        this.playlist = response[0];
        const videoId = response[0].videos[0].videoId;
        this.url = environment.url + 'streams/' + videoId;
        this.title = response[0].videos[0].title;
        this.video.nativeElement.load();
      }
      this.isLoading = false;
    });

    this.playVideoSub = this.playlistService.getPlayVideoSub().subscribe(response => {
      this.playlist = response.activePlaylist;
      this.url = environment.url + 'streams/' + response.videoId;
      this.title = response.title;
      this.video.nativeElement.load();
    });
  }

  ngOnDestroy() {
    this.playlistsSub.unsubscribe();
    this.playVideoSub.unsubscribe();
    this.showLoginSub.unsubscribe();
  }
}
