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
  MatTooltipModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { StreamComponent } from './stream/stream.component';
import { MenusComponent } from './menus/menus.component';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogComponent } from './dialog/dialog.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { GeneralComponent } from './admin-panel/general/general.component';
import { PlaylistComponent } from './admin-panel/playlist/playlist.component';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
    MenusComponent,
    HeaderComponent,
    DialogComponent,
    AdminPanelComponent,
    GeneralComponent,
    PlaylistComponent,
    AuthComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatCardModule,
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
