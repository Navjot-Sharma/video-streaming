import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StreamComponent } from './stream/stream.component';


const routes: Route[] = [
  {path: '', component: StreamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

