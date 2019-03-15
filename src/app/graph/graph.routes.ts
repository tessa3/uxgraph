import { Route } from '@angular/router';
import { GraphComponent } from './graph.component';

export const GraphRoutes: Route[] = [
  { path: 'graph/:graphId', component: GraphComponent }
];
