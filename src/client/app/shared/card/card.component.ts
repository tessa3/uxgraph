import { Component } from '@angular/core';

/**
 * This class represents the Card component.
 */
@Component({
    moduleId: module.id,
    selector: 'card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.css']
})

export class CardComponent {
    name: string;
    lastEdited: string;

    constructor() {
        this.name = 'random card';
        this.lastEdited = 'Just now';
    }
}
