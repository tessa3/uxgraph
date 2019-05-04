import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FabComponent } from './fab/index';
import { ToIterablePipe } from './pipe/to-iterable.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    FabComponent,
    ToIterablePipe,
  ],
  exports: [
    FabComponent,
    ToIterablePipe,
  ]
})
export class SharedModule {
}
