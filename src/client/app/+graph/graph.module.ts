import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [GraphComponent],
    exports: [GraphComponent]
})

export class GraphModule { }
