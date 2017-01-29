import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GoogleRealtimeService} from '../service/google-realtime.service';
import {Card} from '../model/card';
import {Arrow} from '../model/arrow';

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
  addCardsAndArrows() {
    //TODO(eyuelt): is first() the correct way to do this thing only once?
    this.googleRealtimeService.currentDocument.first().subscribe((currentDocument) => {
      let model = currentDocument.getModel();
      let numCards = model.getRoot().get('cards').length;

      let card1 = model.create(Card);
      card1.x = 10 + numCards * 5;
      card1.y = 10 + numCards * 5;
      card1.text = 'card #' + numCards;
      card1.selected = false;
      model.getRoot().get('cards').push(card1);

      let card2 = model.create(Card);
      card2.x = 10 + numCards * 5;
      card2.y = 10 + numCards * 5;
      card2.text = 'card #' + (numCards+1);
      card2.selected = false;
      model.getRoot().get('cards').push(card2);

      let arrow1 = model.create(Arrow);
      arrow1.fromCardId = null;
      arrow1.toCardId = numCards;
      arrow1.tailPosition = {x: card1.x - 50, y: card1.y + 40};
      arrow1.tipPosition = {x: card1.x, y: card1.y + 40};
      model.getRoot().get('arrows').push(arrow1);

      let arrow2 = model.create(Arrow);
      arrow2.fromCardId = numCards;
      arrow2.toCardId = numCards+1;
      arrow2.tailPosition = {x: card1.x + 60, y: card1.y + 40};
      arrow2.tipPosition = {x: card2.x, y: card2.y + 40};
      model.getRoot().get('arrows').push(arrow2);

      let arrow3 = model.create(Arrow);
      arrow3.fromCardId = numCards+1;
      arrow3.toCardId = null;
      arrow3.tailPosition = {x: card2.x + 60, y: card2.y + 40};
      arrow3.tipPosition = {x: card2.x + 60 + 50, y: card2.y + 40};
      model.getRoot().get('arrows').push(arrow3);

      card1.incomingArrow = arrow1;
      card1.outgoingArrow = arrow2;
      card2.incomingArrow = arrow2;
      card2.outgoingArrow = arrow3;
    });
  }

}
