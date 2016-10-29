import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph.component';

@NgModule({
    imports: [CommonModule],
    declarations: [GraphComponent],
    exports: [GraphComponent]
})

export class GraphModule { }
