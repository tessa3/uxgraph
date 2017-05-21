import {
  Component,
  Input,
  OnInit,
  HostListener,
} from '@angular/core';
import {
  CanvasService,
  ViewportCoord,
} from '../canvas/canvas.service';
import {EventUtils} from '../../utils/event-utils';
import {
  GoogleRealtimeService,
  OBJECT_CHANGED
} from '../../service/google-realtime.service';
import { Card } from '../../model/card';
import {Size} from '../../model/geometry';
import {CardSelectionService} from "../../service/card-selection.service";
import {BehaviorSubject} from "rxjs";
import {Collaborator} from "../../model/collaborator";

/**
 * This class represents the Card component.
 */
@Component({
  moduleId: module.id,
  selector: '[uxg-card]',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.css']
})
export class CardComponent implements OnInit {

  // The card data to render on the canvas.
  // TODO(girum): Give these realtime custom models real static types.
  @Input() card: Card = null;

  // A function pointer to the CanvasService's "getBounds()" function.
  @Input() canvasBoundsGetter: (() => ClientRect);

  // The current scale factor of the card shape.
  scale: number = 1;
  // The current display position in the viewport's coordinate space.
  position: ViewportCoord = {x:0, y:0};
  // The size of the card in the canvas' coordinate space.
  size: Size = {width:120, height:160};
  // The radius of the rounded corners in the canvas' coordinate space.
  cornerRadius: number = 1;

  // Whether or not dragging is in progress.
  private dragging: boolean = false;
  // The last point seen during the drag that is currently in progress.
  private lastDragPnt: ViewportCoord = null; //TODO(eyuelt): make this nullable after TS2 update

  // The Observable that contains the list of users selecting this card
  selectingUsersIds: string[] = [];
  selectingCollaborators: Collaborator[] = [];

  constructor(private canvasService: CanvasService,
              private cardSelectionService: CardSelectionService,
              private googleRealtimeService: GoogleRealtimeService) {
  }

  ngOnInit() {
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card.position);
    this.canvasService.addListener(this.update.bind(this));

    let that = this;

    // TODO(girum): Only call update() for this card for change events for this
    // card. That is, don't call update() for this card if some other card
    // changed.
    this.googleRealtimeService.currentDocument.subscribe(document => {
      if (document === null) {
        return;
      }

      document.getModel().getRoot()
          .addEventListener(OBJECT_CHANGED, this.update.bind(this));


      // TODO make sure it's not null
      that.cardSelectionService.getUsersSelectingCard(this.card.id).subscribe((selectorIds: string[]) => {
        this.selectingUsersIds = selectorIds;
        let collaborators: Collaborator[] = [];
        selectorIds.map((selectorId) => {
          let collaborator = that.googleRealtimeService.getCollaborator(selectorId);
          if (collaborator !== null) {
            collaborators.push(collaborator);
          }
        });
        that.selectingCollaborators = collaborators;
      });

    });
  }

  // Called by the CanvasService when a zoom or pan occurs
  update() {
    this.scale = this.canvasService.zoomScale;
    this.position = this.canvasService.canvasCoordToViewportCoord(this.card.position);
  }

  onMousedown(event: MouseEvent) {
    if (EventUtils.eventIsFromPrimaryButton(event)
        // // Don't let the user initiate "drag" if initiated from within the
        // // card's <textarea>.
        && !(event.srcElement instanceof HTMLTextAreaElement)) {
      this.dragging = true;
      const canvasBounds = this.canvasBoundsGetter();
      this.lastDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      if (!this.canvasService.multiSelectMode) {
        this.canvasService.deselectCards();
      }
      this.card.selected = !this.card.selected;
    }
  }

  // Put mousemove on document to allow dragging outside of canvas
  //noinspection JSUnusedGlobalSymbols
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event: MouseEvent) {
    if (this.dragging) {
      event.preventDefault();
      const canvasBounds = this.canvasBoundsGetter();
      const newDragPnt = {
        x: event.clientX - canvasBounds.left,
        y: event.clientY - canvasBounds.top
      };
      this.position.x += newDragPnt.x - this.lastDragPnt.x;
      this.position.y += newDragPnt.y - this.lastDragPnt.y;
      const newCardPosition =
        this.canvasService.viewportCoordToCanvasCoord(this.position);
      this.card.position = {x: newCardPosition.x, y: newCardPosition.y};
      // TODO: move all associated arrows too
      let inArrow = this.card.incomingArrow;
      if (inArrow) {
        inArrow.tipPosition = {x: newCardPosition.x, y: newCardPosition.y + 40};
        if (inArrow.fromCardId === null) {
          inArrow.tailPosition = {x: newCardPosition.x - 50, y: newCardPosition.y + 40};
        }
      }
      let outArrow = this.card.outgoingArrow;
      if (outArrow) {
        outArrow.tailPosition = {x: newCardPosition.x + 60, y: newCardPosition.y + 40};
        if (outArrow.toCardId === null) {
          outArrow.tipPosition = {x: newCardPosition.x + 60 + 50, y: newCardPosition.y + 40};
        }
      }
      this.lastDragPnt = newDragPnt;
    }
  }

  // Put mouseup on document to end drag even if mouseup is outside of canvas
  //noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
  @HostListener('document:mouseup', ['$event'])
  onMouseup(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      this.lastDragPnt = null;
    }
  }

  onClick(event: MouseEvent) {
    if (this.canvasService.multiSelectMode) {
      this.cardSelectionService.continueSelection([this.card.id]);
    } else {
      this.cardSelectionService.startSelection([this.card.id]);
    }
  }

  onCardTextareaKeyup(textAreaValue: string) {
    this.card.text = textAreaValue;
  }

  onCardTextareaFocus() {
    this.canvasService.deselectCards();
    this.card.selected = true;
  }

}
