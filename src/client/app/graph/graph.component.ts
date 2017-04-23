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
      card1.position = {x: 10 + numCards * 20, y: 10 + numCards * 20};
      card1.text = 'card #' + numCards++;
      card1.selected = false;
      model.getRoot().get('cards').push(card1);

      let card2 = model.create(Card);
      card2.position = {x: card1.position.x + 200, y: card1.position.y + 100};
      card2.text = 'card #' + numCards++;
      card2.selected = false;
      model.getRoot().get('cards').push(card2);

      let card3 = model.create(Card);
      card3.position = {x: card1.position.x, y: card1.position.y + 200};
      card3.text = 'card #' + numCards++;
      card3.selected = false;
      model.getRoot().get('cards').push(card3);

      let arrow1 = model.create(Arrow);
      arrow1.fromCard = null;
      arrow1.toCard = card1;
      arrow1.tailPosition = {x: card1.position.x - 50, y: card1.position.y + 80};
      arrow1.tipPosition = {x: card1.position.x, y: card1.position.y + 80};
      model.getRoot().get('arrows').push(arrow1);

      let arrow2 = model.create(Arrow);
      arrow2.fromCard = card1;
      arrow2.toCard = card2;
      arrow2.tailPosition = {x: card1.position.x + 120, y: card1.position.y + 80};
      arrow2.tipPosition = {x: card2.position.x, y: card2.position.y + 80};
      model.getRoot().get('arrows').push(arrow2);

      let arrow3 = model.create(Arrow);
      arrow3.fromCard = card2;
      arrow3.toCard = null;
      arrow3.tailPosition = {x: card2.position.x + 120, y: card2.position.y + 80};
      arrow3.tipPosition = {x: card2.position.x + 120 + 50, y: card2.position.y + 80};
      model.getRoot().get('arrows').push(arrow3);

      let arrow4 = model.create(Arrow);
      arrow4.fromCard = null;
      arrow4.toCard = card3;
      arrow4.tailPosition = {x: card3.position.x - 50, y: card3.position.y + 80};
      arrow4.tipPosition = {x: card3.position.x, y: card3.position.y + 80};
      model.getRoot().get('arrows').push(arrow4);

      let arrow5 = model.create(Arrow);
      arrow5.fromCard = card3;
      arrow5.toCard = card2;
      arrow5.tailPosition = {x: card3.position.x + 120, y: card3.position.y + 80};
      arrow5.tipPosition = {x: card2.position.x, y: card2.position.y + 80};
      model.getRoot().get('arrows').push(arrow5);

      card1.incomingArrows.push(arrow1);
      card1.outgoingArrows.push(arrow2);
      card2.incomingArrows.push(arrow2);
      card2.outgoingArrows.push(arrow3);
      card3.incomingArrows.push(arrow4);
      card3.outgoingArrows.push(arrow5);
      card2.incomingArrows.push(arrow5);
    });
  }

}
