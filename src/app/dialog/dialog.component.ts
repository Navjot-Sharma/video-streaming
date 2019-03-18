import { Inject, Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './dialog.component.html'
})
export class DialogComponent implements OnInit {
  input;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { result: string; message: string; input?: boolean }
  ) {}
  ngOnInit() {
    if (!this.data.input) {
      this.input = true;
    }
  }
}
