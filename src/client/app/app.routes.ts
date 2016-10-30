import { Routes } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { GraphRoutes } from './+graph/index';
import { HomeRoutes } from './+home/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...GraphRoutes
];
