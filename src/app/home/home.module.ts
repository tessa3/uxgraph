import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { GraphPreviewListService } from './graph-preview-list/index';
import { GraphPreviewComponent } from './graph-preview/graph-preview.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      RouterModule
    ],
    declarations: [
      GraphPreviewComponent,
      HomeHeaderComponent,
      HomeComponent
    ],
    exports: [HomeComponent],
    providers: [GraphPreviewListService]
})

export class HomeModule { }
