import {GoogleRealtimeService, OBJECT_CHANGED} from "./google-realtime.service";
import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import ObjectChangedEvent = gapi.drive.realtime.ObjectChangedEvent;
import {Collaborator} from "../model/collaborator";

const SELECTIONS = 'selections';
const CARDS = 'cards';
const USERS = 'users';
const COLLABORATORS = 'collaborators';

/**
 * A service to manage card selection state using Google's Realtime API.
 */
@Injectable()
export class CardSelectionService {

    userId: string;
    cardIdToSelectingUsersIdsMapping: { [key:string]:BehaviorSubject<string[]>; } = {};

    constructor(private googleRealtimeService: GoogleRealtimeService) {
        // TODO must be a better way of getting the userId...
        googleRealtimeService.collaborators.subscribe((collaborators) => {
            if (!!this.userId) { return; }
            for (let index in collaborators) {
                let collaborator = collaborators[index];
                if (collaborator.isMe) {
                    this.userId = collaborator.userId;
                }
            }
        });

        // Make sure card selections object is in Realtime TODO dont subscribe
        this.googleRealtimeService.currentDocument.subscribe((document) => {
            if (!document || !this.userId) {
                return;
            }

            let model = document.getModel();

            // if the card selections object doesn't exist, create it
            let cardSelections = model.getRoot().get(SELECTIONS);
            if (!cardSelections) {
                model.beginCompoundOperation('Initializing Realtime selections object');
                model.getRoot().set(SELECTIONS, model.createMap());
                cardSelections = model.getRoot().get(SELECTIONS);
                cardSelections.set(CARDS, model.createMap());
                cardSelections.set(USERS, model.createMap());
                model.endCompoundOperation();
            }
        });
    }

    /**
     * TODO comment
     */
    startSelection(cardIds: string[]) {
        this._selectCards(cardIds, true);
    }

    /**
     * Adds the selected cards
     */
    continueSelection(cardIds: string[]) {
        this._selectCards(cardIds, false);
    }

    /**
     * Selects the provided cards for the provided user.
     * @param cardIds Selects the cards with these ids
     * @param userId Selects the cards as the user with this id
     * @param isNewSelection If true, clears existing card selections for this user
     * @private
     */
    private _selectCards(cardIds: string[], isNewSelection: boolean) {
        if (!cardIds || cardIds.length === 0) { return; }

        // this.googleRealtimeService.currentDocument.subscribe((document) => {
        let document = this.googleRealtimeService.currentDocument.getValue();

        if (!document || !this.userId) {
            return;
        }

        // clear selection
        // for each card in cardIds
        //   get the card in cardSelections.cards
        //   if it doesn't exist, create it
        //   add collaborator.userId to cardSelections.cards.cardId map
        //   get cardSelections.users
        //   if it doesn't exist, create it
        //   add cardId to collaborator.users.userId map

        let model = document.getModel();

        model.beginCompoundOperation(`Starting selection for ${cardIds.length}`);

        // TODO dont do anything if this is the exact same selection we already had

        if (isNewSelection) {
            this.clearSelection();
        }

        for (let cardId of cardIds) {
            let selectionsObject = model.getRoot().get(SELECTIONS);

            // Add user to card map
            let cardsSelected = selectionsObject.get(CARDS);

            // Get the map for this card (create it if it doesn't exist)
            let card = cardsSelected.get(cardId);
            if (!card) {
                cardsSelected.set(cardId, model.createMap());
                card = cardsSelected.get(cardId);
            }

            card.set(this.userId, true);

            // Add card to user map
            let usersWithSelections = selectionsObject.get(USERS);

            // Get the map for this user (create it if it doesn't exist)
            let user = usersWithSelections.get(this.userId);
            if (!user) {
                usersWithSelections.set(this.userId, model.createMap());
                user = usersWithSelections.get(this.userId);
            }

            user.set(cardId, true);
        }
        model.endCompoundOperation();
        // });
    }

    /**
     * Deselects all of the cards selected by the authenticated user
     */
    clearSelection() {
        this.googleRealtimeService.currentDocument.subscribe((document) => {
            if (document === null|| typeof this.userId === 'undefined') {
                return;
            }

            let model = document.getModel();

            let userSelection = model.getRoot().get(SELECTIONS).get(USERS).get(this.userId);
            if (!userSelection) {
                return;
            }

            // Get the list of cards
            model.beginCompoundOperation(`Clearing selections for user: ${this.userId}`);

            let userSelectionList = userSelection.keys();

            // Clear the user id from each card's selection list
            for (let index in userSelectionList) {
                let cardId = userSelectionList[index];
                model.getRoot().get(SELECTIONS).get(CARDS).get(cardId).delete(this.userId);
            }

            // Clear selected cards for user
            model.getRoot().get(SELECTIONS).get(USERS).set(this.userId, model.createMap());
            model.endCompoundOperation();
        });
    }

    /**
     * Deselect these cards
     */
    deselect(cardIds: string[]) {
        this.googleRealtimeService.currentDocument.subscribe((document) => {
            if (!document || !this.userId) {
                return;
            }

            let model = document.getModel();

            // Get the list of cards
            model.beginCompoundOperation(`Clearing selection for cards: ${cardIds}`);

            // Clear the user id from each card's selection list
            for (let index in cardIds) {
                let cardId = cardIds[index];
                model.getRoot().get(SELECTIONS).get(CARDS).get(cardId).delete(this.userId);
            }

            // Clear selected cards for user
            model.getRoot().get(SELECTIONS).get(USERS).set(this.userId, model.createMap());
            model.endCompoundOperation();
        });
    }

    /**
     * TODO comment
     */
    getUsersSelectingCard(cardId: string): any {
        let document = this.googleRealtimeService.currentDocument.getValue();
        if (!document) {
            return null;
        }

        if (this.cardIdToSelectingUsersIdsMapping[cardId]) {
            return this.cardIdToSelectingUsersIdsMapping[cardId];
        }

        let model = document.getModel();
        let card = model.getRoot().get(SELECTIONS).get(CARDS).get(cardId);
        if (!card) {
            console.error(`Card with id '${cardId}' does not exist`);
            this._createSelectionsArrayForCard(cardId);
            card = model.getRoot().get(SELECTIONS).get(CARDS).get(cardId);
        }

        // create observable, wire it up with realtime, and return it
        let subject = new BehaviorSubject<string[]>(card.keys());
        card.addEventListener(OBJECT_CHANGED, (event: ObjectChangedEvent) => {
            subject.next(((event.target as any).keys()));
        });
        this.cardIdToSelectingUsersIdsMapping[cardId] = subject;

        return subject;
    }

    /**
     * TODO
     * @param cardId
     * @returns {null}
     * @private
     */
    private _createSelectionsArrayForCard(cardId: string): any {
        let document = this.googleRealtimeService.currentDocument.getValue();
        if (!document) {
            return null;
        }

        let model = document.getModel();
        let card = model.getRoot().get(SELECTIONS).get(CARDS).get(cardId);
        if (!card) {
            model.getRoot().get(SELECTIONS).get(CARDS).set(cardId, model.createMap());
        }
    }
}
