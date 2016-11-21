import { Route } from '@angular/router';
import { GraphComponent } from './index';

export const GraphRoutes: Route[] = [
  {
    path: 'graph/:graphId',
    component: GraphComponent
  }
];
