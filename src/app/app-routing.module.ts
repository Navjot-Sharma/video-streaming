import { EditPlaylistComponent } from './admin-panel/edit-playlist/edit-playlist.component';
import { GeneralComponent } from './admin-panel/general/general.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StreamComponent } from './stream/stream.component';


const routes: Route[] = [
  {path: '', component: StreamComponent},
  {path: 'settings', component: AdminPanelComponent, children: [
    {path: 'general', component: GeneralComponent},
    {path: 'editPlaylist/:id', component: EditPlaylistComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

