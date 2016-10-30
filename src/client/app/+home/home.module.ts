import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { GraphPreviewListService } from '../shared/graph-preview-list/index';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    providers: [GraphPreviewListService]
})

export class HomeModule { }
