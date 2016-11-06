import {Component, OnInit} from '@angular/core';
import {CanvasComponent} from '../shared/index';
import {ActivatedRoute, Params} from "@angular/router";
import {GoogleRealtimeService} from "../shared/google-realtime/google-realtime.service";

/**
 * This class represents the lazy loaded GraphComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css'],
  directives: [CanvasComponent]
})
export class GraphComponent implements OnInit {

  graphId: string;

  constructor(private googleRealtimeService: GoogleRealtimeService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.graphId = params['graphId'];
      this.googleRealtimeService.loadRealtimeDocument(this.graphId);
    });
  }

}
