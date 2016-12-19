import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';

/**
 * This class represents the lazy loaded GraphComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'uxg-graph',
  templateUrl: 'graph.component.html',
  styleUrls: ['graph.component.css']
})
export class GraphComponent implements OnInit {

  // TODO(girum): Each activity should not maintain its own "userLoggedIn"
  // state. This should get extracted out into its own singleton satte.
  userLoggedIn: boolean = false;
  graphId: string;

  constructor(private googleRealtimeService: GoogleRealtimeService,
              private route: ActivatedRoute) {
    this.googleRealtimeService.oauthToken
        .subscribe((oauthToken) => {
          if (!!oauthToken) {
            this.userLoggedIn = true;
          }
        });
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.graphId = params['graphId'];
      this.googleRealtimeService.loadRealtimeDocument(this.graphId);
    });
  }

}
