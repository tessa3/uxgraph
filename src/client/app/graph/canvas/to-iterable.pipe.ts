import {Pipe, PipeTransform} from '@angular/core';
import {CollaborativeList} from '../../model/collaborative-list';

@Pipe({
  name: 'toIterable'
})
export class ToIterablePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return undefined;
    }

    // if (!(value instanceof CollaborativeList)) {
    //   return undefined;
    // }

    let collaborativeList = value as CollaborativeList<any>;

    value[Symbol.iterator] = function() {
      let nextIndex = 0;

      return {
        next: (): Object => {
          if (nextIndex >= collaborativeList.length) {
            return {done: true};
          }

          let element = collaborativeList.get(nextIndex);
          nextIndex++;
          return {value: element, done: false};
        }
      };
    };

    return value;
  }

}
