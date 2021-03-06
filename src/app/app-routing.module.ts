import { EditPlaylistComponent } from './admin-panel/edit-playlist/edit-playlist.component';
import { GeneralComponent } from './admin-panel/general/general.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StreamComponent } from './stream/stream.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Route[] = [
  {path: '', component: StreamComponent},
  {path: 'settings', redirectTo: 'settings/general', canActivate: [AuthGuard]},
  {path: 'settings', component: AdminPanelComponent,
   canActivate: [AuthGuard],
   children: [
    {path: 'general', component: GeneralComponent},
    {path: 'editPlaylist/:id', component: EditPlaylistComponent}
  ]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

