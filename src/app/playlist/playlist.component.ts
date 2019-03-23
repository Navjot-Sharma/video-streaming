import { Subscription } from 'rxjs';
import { Playlist } from './../shared/playlist.model';
import { PlaylistService } from './../shared/playlist.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent  implements OnInit, OnDestroy {

  playlistsSub: Subscription;
  playlists: Playlist[];

  constructor(private playlistService: PlaylistService) { }

  onPlayVideo(videoId: string, title: string, activePlaylist: Playlist) {
    this.playlistService.getPlayVideoSub().next({videoId, title, activePlaylist});
  }

  ngOnInit() {
    this.playlists = this.playlistService.Playlists;
    this.playlistsSub = this.playlistService.getPlaylistsSub()
     .subscribe( response => this.playlists = response);
  }
  ngOnDestroy() {
    this.playlistsSub.unsubscribe();
  }
}
