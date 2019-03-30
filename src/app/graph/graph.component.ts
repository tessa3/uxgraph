import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, convertToParamMap} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';

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
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  constructor(private googleRealtimeService: GoogleRealtimeService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.forEach((params: Params) => {
      this.graphId = params[GraphComponent.paramKeys.graphId];
      if (this.graphId !== undefined) {
        this.googleRealtimeService.loadRealtimeDocument(this.graphId);
        this.googleRealtimeService.currentDocument.subscribe((currentDocument) => {
          this.realtimeDocument = currentDocument;
        });
      }
    });
  }

  ngOnDestroy() {
    if (this.realtimeDocument) {
      this.realtimeDocument.close();
      this.googleRealtimeService.currentDocument.next(null);
    }
  }
}
