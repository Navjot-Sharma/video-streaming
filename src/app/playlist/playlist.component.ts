import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent  implements OnInit {

  searchForm: FormGroup;

  list = ['one', 'two', 'three'];

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl(null)
    });
  }
}
