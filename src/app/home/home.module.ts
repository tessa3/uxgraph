import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { GraphPreviewComponent } from './graph-preview/graph-preview.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';

@NgModule({
    imports: [
      CommonModule,
      RouterModule,
      SharedModule
    ],
    declarations: [
      GraphPreviewComponent,
      HomeHeaderComponent,
      HomeComponent
    ],
    exports: [
      HomeComponent
    ],
    providers: []
})
export class HomeModule { }
