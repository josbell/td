import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-todo-list-timer',
  templateUrl: './todo-list-timer.component.html',
  styleUrls: ['./todo-list-timer.component.scss']
})
export class TodoListTimerComponent implements OnInit {
  private _timerSubscription: Subscription;
  svg: any;
  _timerMinutes = 1;
  _timerLength = this._timerMinutes * 60000;
  completedPercent = 0;
  inProgress = false;
  α = 0;

  constructor() {}

  ngOnInit() {}

  get timeSpent() {
    return (this.completedPercent / 100) * this._timerLength;
  }


  draw(percent: number) {
    const circlePercent = (percent > 100) ? 100 : percent;
    const boxSize = 50;
    const radius = 25;
    const startPoint = {x: 0, y: 0};
    const angleInDegrees = (circlePercent / 100) * 360;
    const mid = ( angleInDegrees > 180 ) ? 1 : 0;
    const endPoint = this.polarToCartesian(radius, angleInDegrees);

    this.svg = {
      viewBox: `0 0 ${boxSize} ${boxSize}`,
      width: boxSize,
      height: boxSize,
      d: `M ${startPoint.x} ${startPoint.y} v -25 A ${radius} ${radius} 1 ${mid} 1 ${endPoint.x}  ${endPoint.y} z`
    };
  }

  polarToCartesian = (radius, angleInDegrees) => {
    angleInDegrees %= 360;
    const angleInRadius = ( angleInDegrees * Math.PI / 180 );
    const x = Math.sin(angleInRadius) * radius;
    const y = Math.cos(angleInRadius) * radius * -1;
    return {x: x, y: y};
  }

  animate = () => {
    console.log(this.inProgress);
    if (this._timerSubscription && !this._timerSubscription.closed) {
      this._timerSubscription.unsubscribe();
    }
    let count = this.completedPercent;
    const delta = 100 - this.completedPercent;
    const times = delta;
    const step = 1;
    const interval =  Math.round(this._timerLength / times);
    this._timerSubscription = timer(0, interval).subscribe(() => {
      count += step;
      this.completedPercent = count;
      if (count <= 100 && this.inProgress) {
        this.draw(count);
      } else {
        this.inProgress = false;
        this._timerSubscription.unsubscribe();
      }
    });
  }

  handleClick() {
    this.inProgress = !this.inProgress;
    if (this.inProgress) {
      this.animate();
    }
  }

}
