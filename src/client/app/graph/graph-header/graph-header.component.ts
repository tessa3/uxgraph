import {Component} from '@angular/core';
import {User} from '../../model/user';

/**
 * This class represents the App Header component.
 */
@Component({
  moduleId: module.id,
  selector: 'graph-header',
  templateUrl: 'graph-header.component.html',
  styleUrls: ['graph-header.component.css']
})
export class GraphHeaderComponent {

  graphName = 'Untitled graph';
  users: User[] = [
      new User('Nati'),
      new User('Eyuel'),
      new User('Girum')
  ];

}
