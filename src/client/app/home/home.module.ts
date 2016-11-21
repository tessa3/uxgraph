import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { GraphPreviewListService } from './graph-preview-list/index';
import {GraphPreviewComponent} from './graph-preview/graph-preview.component';
import {HomeHeaderComponent} from './home-header/home-header.component';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [
        GraphPreviewComponent,
        HomeHeaderComponent,
        HomeComponent
    ],
    exports: [HomeComponent],
    providers: [GraphPreviewListService]
})

export class HomeModule { }
