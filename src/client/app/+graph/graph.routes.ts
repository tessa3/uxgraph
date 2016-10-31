import { Route } from '@angular/router';
import { GraphComponent } from './index';

export const GraphRoutes: Route[] = [
  {
    path: 'id/:graphId',
    component: GraphComponent
  }
];
