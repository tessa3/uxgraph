import { Routes } from '@angular/router';

import { GraphRoutes } from './graph/index';
import { HomeRoutes } from './home/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...GraphRoutes
];
