import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

import { environment as env } from './../../environments/environment';
import { Playlist } from './playlist.model';

@Injectable({ providedIn: 'root' })
export class PlaylistService {

  private isAdminPlaylist = false;
  private playlists: Playlist[] = [];
  private playlistsSub = new Subject<Playlist[]>();
  private playVideoSub = new Subject<{
    videoId: string; title: string, activePlaylist: Playlist
  }>();

  constructor(
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  get IsAdminPlaylist() {
    return this.isAdminPlaylist;
  }
  get Playlists() {
    return this.playlists;
  }
  getPlaylistsSub() {
    return this.playlistsSub.asObservable();
  }

  getPlayVideoSub() {
    return this.playVideoSub;
  }

  fetchPlaylists() {
    let userId = 'guest';
    if (this.authService.IsAuthenticated) {
      userId = this.authService.User._id;
    }
    this.http
      .get<{ playlists: Playlist[]; isAdminPlaylist: boolean }>(
        env.url + 'playlists/' + userId
      )
      .subscribe(response => {
        this.isAdminPlaylist = response.isAdminPlaylist;
        this.playlists = response.playlists;
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
          this.isAdminPlaylist = false;
          this.playlists = response.playlists;
          this.playlistsSub.next(this.playlists);
          this.showSnackBar('New playlist created');
        }
      );
  }

  updatePlaylist(activePlaylistId: string, name: string) {
    this.http
      .put<{ playlists: Playlist[] }>(
        env.url + 'playlists/' + activePlaylistId,
        { name }
      )
      .subscribe(response => {
        this.playlists = response.playlists;
        this.playlistsSub.next(this.playlists);
        this.showSnackBar('Playlist renamed');
      });
  }

  deletePlaylist(playlistId: string) {
    this.http
      .delete<{ playlists: Playlist[] }>(env.url + 'playlists/' + playlistId)
      .subscribe(response => {
        this.playlists = response.playlists;
        this.playlistsSub.next(this.playlists);
        this.showSnackBar('Playlist deleted');
        this.router.navigate(['/settings/general']);
        if (this.playlists.length === 0) {
          this.fetchPlaylists();
        }
      });
  }

  addVideo(videoId: string, playlistId: string) {
    this.http
      .post<{ playlists: Playlist[] }>(env.url + 'videos', {
        videoId,
        playlistId
      })
      .subscribe(response => {
        this.playlists = response.playlists;
        this.playlistsSub.next(this.playlists);
        this.showSnackBar('New video added');
      }, error => {
        this.showSnackBar(error.error);
      });
  }

  deleteVideo(playlistId: string, videoId: string) {
    this.http
      .delete<{ playlists: Playlist[] }>(
        env.url + `videos/${playlistId}/${videoId}`
      )
      .subscribe(response => {
        this.playlists = response.playlists;
        this.playlistsSub.next(this.playlists);
        this.showSnackBar('Video removed');
      });
  }

  showSnackBar(message: string, action?: string, timing?: number) {
    this.snackBar.open(message, action || 'Ok', { duration: timing || 2000 });
  }
}
