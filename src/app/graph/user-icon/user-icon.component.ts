import {Component, Input} from '@angular/core';
import {Collaborator} from '../../model/collaborator';

@Component({
  selector: 'uxg-user-icon',
  templateUrl: 'user-icon.component.html',
  styleUrls: ['user-icon.component.css']
})
export class UserIconComponent {
  @Input() user!: Collaborator;
}
