import { Component, OnInit } from '@angular/core';
import { GraphPreviewListService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  newGraphPreview: string = '';
  errorMessage: string;
  graphPreviews: any[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * GraphPreviewListService.
   *
   * @param {GraphPreviewListService} GraphPreviewListService - The injected GraphPreviewListService.
   */
  constructor(public graphPreviewListService: GraphPreviewListService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getGraphPreviews();
  }

  /**
   * Handle the nameListService observable
   */
  getGraphPreviews() {
    this.graphPreviewListService.get()
                     .subscribe(
                       graphPreviews => this.graphPreviews = graphPreviews,
                       error => this.errorMessage = <any>error
                       );
  }

  /**
   * Pushes a new name onto the names array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addName(): boolean {
    // TODO: implement nameListService.post
    this.graphPreviews.push(this.newGraphPreview);
    this.newGraphPreview = '';
    return false;
  }

}
