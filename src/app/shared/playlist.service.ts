import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

import { environment as env } from './../../environments/environment';
import { Playlist } from './playlist.model';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private playlists: Playlist[] = [];
  private playlistsSub = new Subject<Playlist[]>();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  get Playlists() {
    return this.playlists;
  }
  getPlaylistsSub() {
    return this.playlistsSub.asObservable();
  }

  fetchPlaylists() {
    this.http
      .get<{ playlists: Playlist[] }>(
        env.url + 'playlists/' + this.authService.User._id)
      .subscribe(response => {
        console.log('fetch service', response);
        if (response) {
          this.playlists = response.playlists;
        }
        this.playlistsSub.next(this.playlists);
      });
  }

  createPlaylist(name: string) {
    const postData = {
      name,
      userId: this.authService.User._id
    };
    this.http
      .post<{ playlists: Playlist[] }>(env.url + 'playlists', postData)
      .subscribe(
        response => {
          console.log('create', response);
          this.playlists = response.playlists;
          this.playlistsSub.next(this.playlists);
        },
        err => {}
      );
  }

  deletePlaylist(playlistId: string) {
    this.http.delete<{playlists: Playlist[]}>(env.url + 'playlists/' + playlistId)
     .subscribe(response => {
      this.playlists = response.playlists;
      this.playlistsSub.next(this.playlists);
      this.router.navigate(['/settings/general']);
     });
  }

  addVideo(videoId: string, playlistId: string) {
    this.http
      .post<{ playlists: Playlist[] }>(env.url + 'videos', {
        videoId,
        playlistId
      })
      .subscribe(response => {
        console.log(response);
        this.playlists = response.playlists;
        this.playlistsSub.next(this.playlists);
      });
  }

  deleteVideo(playlistId: string, videoId: string) {
    this.http.delete<{playlists: Playlist[]}>(env.url + `videos/${playlistId}/${videoId}`)
     .subscribe(response => {
       console.log('delete', response);
      this.playlists = response.playlists;
      this.playlistsSub.next(this.playlists);
     });
  }
}
