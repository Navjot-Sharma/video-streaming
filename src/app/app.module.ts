import { MatListModule } from '@angular/material/list';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatCardModule,
  MatButtonModule,
  MatTabsModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatTooltipModule,
  MatMenuModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { StreamComponent } from './stream/stream.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { GeneralComponent } from './admin-panel/general/general.component';
import { EditPlaylistComponent } from './admin-panel/edit-playlist/edit-playlist.component';
import { AuthComponent } from './auth/auth.component';
import { PlaylistComponent } from './playlist/playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
    HeaderComponent,
    DialogComponent,
    AdminPanelComponent,
    GeneralComponent,
    EditPlaylistComponent,
    AuthComponent,
    PlaylistComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule {}
