import { DialogComponent } from 'src/app/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  constructor(private dialog: MatDialog) {}

  createPlaylist() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { result: 'Create new playlist', message: '', input: true }
    });
    dialogRef.afterClosed().subscribe( response => {
      console.log(response);
    });
  }
}
