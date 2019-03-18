import { PlaylistService } from './../shared/playlist.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private playlistService: PlaylistService) { }

  onCreatePlaylist() {
    this.playlistService.createPlaylist();
  }
  ngOnInit() {
  }

}
