import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DocumentService } from '../service/document.service';

/**
 * This class represents the GraphComponent.
 */
@Component({
  selector: 'uxg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements OnDestroy {

  // The names of the expected url params for this page.
  static readonly paramKeys = {
    graphId: 'graphId'
  };

  graphId: string|undefined;

  constructor(private documentService: DocumentService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.forEach((params: Params) => {
      this.graphId = params[GraphComponent.paramKeys.graphId];
      if (this.graphId !== undefined) {
        this.documentService.load(this.graphId);
      }
    });
  }

  ngOnDestroy() {
    this.documentService.close();
  }
}
