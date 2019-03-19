import { Subscription } from 'rxjs';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { User } from './../shared/user.model';
import { AuthService } from './../auth/auth.service';
import { PlaylistService } from './../shared/playlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Playlist } from '../shared/playlist.model';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  user: User;
  playlists: Playlist[];
  playlistsSub: Subscription;

  constructor(
    private playlistService: PlaylistService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  onCreatePlaylist() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { result: 'Create new playlist', message: '', input: true }
    });
    dialogRef.afterClosed().subscribe(response => {
      console.log(response);
      if (response === '') {
        return this.snackBar.open('Playlist not created', 'Ok', {
          duration: 2000
        });
      }
      this.playlistService.createPlaylist(response);
    });
  }
  ngOnInit() {
    this.user = this.authService.User;
    this.playlistService.fetchPlaylists();
    this.playlists = this.playlistService.Playlists;
    this.playlistsSub = this.playlistService.getPlaylistsSub()
     .subscribe( response => {
       this.playlists = response;
       console.log('admin', this.playlists);
      });
  }
  ngOnDestroy() {
    this.playlistsSub.unsubscribe();
  }
}
