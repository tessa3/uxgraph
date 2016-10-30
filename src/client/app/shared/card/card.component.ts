import { Component, Input } from '@angular/core';

/**
 * This class represents the Card component.
 */
@Component({
    moduleId: module.id,
    selector: 'uxg-card',
    templateUrl: 'card.component.html',
    styleUrls: ['card.component.css']
})

export class CardComponent {
    @Input() name: string;
    lastEdited: string;

    constructor() {
        this.name = null;
        this.lastEdited = null;
    }
}
