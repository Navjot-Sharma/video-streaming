import { PlaylistComponent } from './admin-panel/playlist/playlist.component';
import { GeneralComponent } from './admin-panel/general/general.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StreamComponent } from './stream/stream.component';


const routes: Route[] = [
  {path: '', component: StreamComponent},
  {path: 'settings', component: AdminPanelComponent, children: [
    {path: 'general', component: GeneralComponent},
    {path: 'playlist/:id', component: PlaylistComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

