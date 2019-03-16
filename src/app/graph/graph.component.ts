import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';

/**
 * This class represents the GraphComponent.
 */
@Component({
  selector: 'uxg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {

  graphId: string|undefined;
  private realtimeDocument: gapi.drive.realtime.Document|null = null;

  constructor(private googleRealtimeService: GoogleRealtimeService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.graphId = params['graphId'];
      if (this.graphId) {
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
