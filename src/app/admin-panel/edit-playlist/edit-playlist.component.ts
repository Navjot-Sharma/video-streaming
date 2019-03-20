import { Subscription } from 'rxjs';
import { PlaylistService } from './../../shared/playlist.service';
import { Playlist } from './../../shared/playlist.model';
import { MatSnackBar } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit {
  isLoading = true;
  editMode = false;
  playlistsSub: Subscription;
  activePlaylist: Playlist;
  newVideo = 'https://www.youtube.com/watch?v=';

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private playlistService: PlaylistService
  ) {}

  onAddVideo() {
    const videoId = this.newVideo.split('=')[1];
    if (!videoId) {
      return this.snackBar.open('Please enter a valid video id');
    }
    this.playlistService.addVideo(videoId, this.route.snapshot.params['id']);
  }

  onRemoveVideo(videoId: string) {
    this.playlistService.deleteVideo(this.activePlaylist._id, videoId);
  }

  onDeletePlaylist() {
    this.playlistService.deletePlaylist(this.activePlaylist._id);
  }

  ngOnInit() {
    this.playlistsSub = this.playlistService
      .getPlaylistsSub()
      .subscribe(response => {
        this.isLoading = true;
        this.activePlaylist = response.find(playlist => {
          return playlist._id === this.route.snapshot.params['id'];
        });
        console.log('edit playlist', this.activePlaylist);
        this.isLoading = false;
      });
    this.route.paramMap.subscribe(param => {
      this.isLoading = true;
      this.activePlaylist = this.playlistService.Playlists.find(playlist => {
        return playlist._id === param.get('id');
      });
      console.log('param play', this.activePlaylist);
      this.isLoading = false;
    });
  }
}
