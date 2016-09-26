import { Component, OnInit } from '@angular/core';
import { CardListService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  newCard: string = '';
  errorMessage: string;
  cards: any[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * CardListService.
   *
   * @param {CardListService} cardListService - The injected CardListService.
   */
  constructor(public cardListService: CardListService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getCards();
  }

  /**
   * Handle the nameListService observable
   */
  getCards() {
    this.cardListService.get()
                     .subscribe(
                       cards => this.cards = cards,
                       error =>  this.errorMessage = <any>error
                       );
  }

  /**
   * Pushes a new name onto the names array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addName(): boolean {
    // TODO: implement nameListService.post
    this.cards.push(this.newCard);
    this.newCard = '';
    return false;
  }

}
