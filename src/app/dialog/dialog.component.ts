import { Inject, Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {result: string, message: string}
    ) {}
}
