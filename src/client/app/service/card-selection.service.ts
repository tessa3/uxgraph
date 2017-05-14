import {GoogleRealtimeService} from "./google-realtime.service";
import {Injectable} from "@angular/core";

const SELECTIONS = 'selections';
const CARDS = 'cards';
const USERS = 'users';

/**
 * A service to manage card selection state using Google's Realtime API.
 */
@Injectable()
export class CardSelectionService {

    constructor(private googleRealtimeService: GoogleRealtimeService) {
        // Make sure card selections object is in Realtime
        this.googleRealtimeService.currentDocument.subscribe((document) => {
            if (document === null) {
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

        this.startSelection(['card1', 'card2', 'card3'], 'user1');
    }

    /**
     * TODO comment
     */
    startSelection(cardIds: string[], userId: string) {

        if (!cardIds || cardIds.length === 0) { return; }

        this.googleRealtimeService.currentDocument.subscribe((document) => {
            if (document === null) {
                return;
            }

            // clear selection
            // for each card in cardIds
                // get the card in cardSelections.cards
                // if it doesn't exist, create it
                // add collaborator.userId to cardSelections.cards.cardId map
                // get cardSelections.users
                // if it doesn't exist, create it
                // add cardId to collaborator.users.userId map

            let model = document.getModel();

            model.beginCompoundOperation(`Starting selection for ${cardIds.length}`);
            this.clearSelection();

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

                card.set(userId, true);

                // Add card to user map
                let usersWithSelections = selectionsObject.get(USERS);

                // Get the map for this user (create it if it doesn't exist)
                let user = usersWithSelections.get(userId);
                if (!user) {
                    usersWithSelections.set(userId, model.createMap());
                    user = usersWithSelections.get(userId);
                }

                user.set(cardId, true);
            }
            model.endCompoundOperation();
        });

        // model.beginCompoundOperation();
        // this.clearSelection();
        // for each card in cardIds
            // get the card in cardSelections.cards
            // if it doesn't exist, create it
            // add collaborator.userId to cardSelections.cards.cardId map
            // get cardSelections.users
            // if it doesn't exist, create it
            // add cardId to collaborator.users.userId map
        // model.endCompoundOperation();

        // this.googleRealtimeService.currentDocument.subscribe((document) => {
        //     console.log('document = ' + document);
        // });
    }

    /**
     * Adds the selected cards
     */
    continueSelection(cardIds: string[]) {

    }

    /**
     * Deselects all of the cards selected by the authenticated user
     */
    clearSelection() {

        return this;
    }

    /**
     * Deselect these cards
     */
    deselect(cardIds: string[]) {

    }

    /**
     * TODO comment
     */
    getSelectingUsers(cardId: string) {

    }
}