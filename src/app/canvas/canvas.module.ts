import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanvasComponent } from './canvas/canvas.component';
import { CardComponent } from './card/card.component';
import { ArrowComponent } from './arrow/arrow.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    CardComponent,
    ArrowComponent,
    CanvasComponent,
  ],
  exports: [
    CanvasComponent,
  ]
})
export class CanvasModule {
}
