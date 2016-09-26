import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/index';
import { SidePanelComponent } from './side-panel/index';
import { AppHeaderComponent } from './app-header/index';
import { CardComponent } from './card/index';
import { NameListService } from './name-list/index';
import { CardListService } from './card-list/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [NavbarComponent, AppHeaderComponent, SidePanelComponent, CardComponent],
  exports: [NavbarComponent, AppHeaderComponent, SidePanelComponent, CardComponent,
    CommonModule, FormsModule, RouterModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [NameListService, CardListService]
    };
  }
}
