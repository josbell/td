import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDuration'
})
export class TimeDurationPipe implements PipeTransform {

  transform(minutes: number): string {
    return minutes < 60 ? `${minutes} min` : `${Math.floor( minutes / 60 )} hr ${ minutes % 60 } min`;
  }

}
