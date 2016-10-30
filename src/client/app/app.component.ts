import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Config } from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, GraphComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-app',
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES]
})

export class AppComponent {
  constructor() {
    console.log('Environment config', Config);
  }
}
