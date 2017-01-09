import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';
import {Card} from '../model/card';

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

  graphId: string;

  constructor(private googleRealtimeService: GoogleRealtimeService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.params.forEach((params: Params) => {
      this.graphId = params['graphId'];
      this.googleRealtimeService.loadRealtimeDocument(this.graphId);
    });
  }

  //TODO(eyuelt): this is a temporary hack for adding cards to canvas
  addCard() {
    this.googleRealtimeService.currentDocument.first().subscribe((currentDocument) => {
      let model = currentDocument.getModel();
      let numCards = model.getRoot().get('cards').length;
      let card = model.create(Card);
      card.x = 10 + numCards * 5;
      card.y = 10 + numCards * 5;
      card.text = 'card #' + numCards;
      card.selected = false;
      model.getRoot().get('cards').push(card);
    });
  }

}
