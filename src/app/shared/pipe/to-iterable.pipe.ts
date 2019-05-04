import {Pipe, PipeTransform} from '@angular/core';
import CollaborativeList = gapi.drive.realtime.CollaborativeList;

@Pipe({
  name: 'toIterable'
})
export class ToIterablePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (!value) {
      return undefined;
    }

    const collaborativeList = value as CollaborativeList<any>;

    value[Symbol.iterator] = () => {
      let nextIndex = 0;

      return {
        next: (): object => {
          if (nextIndex >= collaborativeList.length) {
            return {done: true};
          }

          const element = collaborativeList.get(nextIndex);
          nextIndex++;
          return {value: element, done: false};
        }
      };
    };

    return value;
  }

}
