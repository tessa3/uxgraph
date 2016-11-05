import { Component, Input } from '@angular/core';

/**
 * This class represents the GraphPreview component.
 */
@Component({
    moduleId: module.id,
    selector: 'uxg-graph-preview',
    templateUrl: 'graph-preview.component.html',
    styleUrls: ['graph-preview.component.css']
})

export class GraphPreviewComponent {
    @Input() name: string;
    lastEdited: string;

    constructor() {
        this.name = null;
        this.lastEdited = null;
    }
}
