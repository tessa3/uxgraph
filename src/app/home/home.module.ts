import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { GraphPreviewComponent } from './graph-preview/graph-preview.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared';

@NgModule({
    imports: [
      CommonModule,
      HttpModule,  // tslint:disable-line:deprecation
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
