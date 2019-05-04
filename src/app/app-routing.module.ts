import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeRoutes } from './home';
import { GraphRoutes } from './graph';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  ...HomeRoutes,
  ...GraphRoutes,
  // TODO(eyuelt): { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
