import {Component, Input} from '@angular/core';
import {Collaborator} from '../../model/collaborator';

@Component({
  moduleId: module.id,
  selector: 'user-icon',
  templateUrl: 'user-icon.component.html',
  styleUrls: ['user-icon.component.css']
})
export class UserIconComponent {
  @Input() user: Collaborator;
}
