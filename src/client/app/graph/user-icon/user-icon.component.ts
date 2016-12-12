import {Component, Input} from '@angular/core';
import {User} from '../../model/user';

@Component({
  moduleId: module.id,
  selector: 'user-icon',
  templateUrl: 'user-icon.component.html',
  styleUrls: ['user-icon.component.css']
})
export class UserIconComponent {
  @Input() user: User;
}
