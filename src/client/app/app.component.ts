import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Config, NavbarComponent, ToolbarComponent, CardComponent} from './shared/index';
import './shared/card/card'

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, ToolbarComponent, CardComponent]
})

export class AppComponent {
  card: Card = null;
  constructor() {
    console.log('Environment config', Config);
    this.card = new Card(50, 50, 50);
  }
}
