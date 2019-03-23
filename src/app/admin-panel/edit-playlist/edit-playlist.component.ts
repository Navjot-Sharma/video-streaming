import { Subscription } from 'rxjs';
import { PlaylistService } from './../../shared/playlist.service';
import { Playlist } from './../../shared/playlist.model';
import { MatSnackBar, MatDialog } from '@angular/material';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit, OnDestroy {

  isLoading = true;
  editMode = false;
  playlistsSub: Subscription;
  activePlaylist: Playlist;
  newVideo = 'https://www.youtube.com/watch?v=';

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private playlistService: PlaylistService
  ) {}

  onAddVideo() {
    const newVideoId = this.newVideo.split('=')[1];
    if (!newVideoId) {
      return this.snackBar.open('Video not found', 'Ok', {
        duration: 2000
      });
    }
    const isFound = this.activePlaylist.videos.find(
      video => video.videoId === newVideoId
    );
    if (isFound) {
      return this.snackBar.open('Video already exist', 'Ok', {
        duration: 2000
      });
    }
    this.playlistService.addVideo(newVideoId, this.route.snapshot.params['id']);
  }

  onRemoveVideo(videoId: string) {
    this.playlistService.deleteVideo(this.activePlaylist._id, videoId);
  }

  onRenamePlaylist() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { result: 'Rename playlist', message: '', input: true }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (
        response === '' ||
        response === undefined ||
        response === this.activePlaylist.name
      ) {
        return this.snackBar.open('Playlist not renamed', 'Ok', {
          duration: 2000
        });
      }
      this.playlistService.updatePlaylist(this.activePlaylist._id, response);
    });
  }
  onDeletePlaylist() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        result: 'Delete playlist?',
        message: 'Please enter playlist name to delete',
        input: true
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (
        response === '' ||
        response === undefined ||
        response !== this.activePlaylist.name
      ) {
        return this.snackBar.open('Playlist not deleted', 'Ok', {
          duration: 2000
        });
      }
      this.playlistService.deletePlaylist(this.activePlaylist._id);
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      this.isLoading = true;
      if (this.playlistService.Playlists.length > 0) {
        this.activePlaylist = this.playlistService.Playlists.find(playlist => {
          return playlist._id === param.get('id');
        });
        this.isLoading = false;
      }
    });

    this.playlistsSub = this.playlistService
      .getPlaylistsSub()
      .subscribe(response => {
        this.isLoading = true;
        this.activePlaylist = response.find(playlist => {
          return playlist._id === this.route.snapshot.params['id'];
        });
        this.isLoading = false;
      });
  }

 ngOnDestroy() {
   this.playlistsSub.unsubscribe();
 }
}
