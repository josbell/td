import { map, tap } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, timer, interval } from 'rxjs';

@Component({
  selector: 'app-todo-list-timer',
  templateUrl: './todo-list-timer.component.html',
  styleUrls: ['./todo-list-timer.component.scss']
})
export class TodoListTimerComponent implements OnChanges {
  @Input() timerDurationMins = 30;
  @Output() timerStopped: EventEmitter<number> = new EventEmitter();
  svg: any;
  minutesElapsed = 0;
  inProgress = false;
  private _completedPercent = 0;
  private _timerSubscription: Subscription;
  private _cachedTime = 0;
  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['timerDurationMins'] && changes['timerDurationMins'].currentValue <= 0 ) {
      this.timerDurationMins = 30;
    }
  }

  handleClick() {
    this.inProgress = !this.inProgress;
    if (this.inProgress) {
      this.animate();
    } else {
      this.handleTimerStopped();
    }
  }

  getCurrentPercent = () => (this.minutesElapsed / this.timerDurationMins) * 100;

  unsubscribeIfNeeded = (subs: Subscription) => subs && !subs.closed && subs.unsubscribe();

  animate = () => {
    this.unsubscribeIfNeeded(this._timerSubscription);

    this._completedPercent = this.getCurrentPercent();
    const step = Math.round(100 / this.timerDurationMins);
    const t =  60000; // decided on 1 minute intervals for performance

    this.draw(1); // To display a small portion of the timer and let user know that timer started counting;
    this._timerSubscription = timer(t, t).subscribe(() => {
      this.incrementMinute(step);
      if (this._completedPercent >= 100) {
        this.handleTimerStopped();
        this.resetTimer();
      }
    });
  }

  incrementMinute = (step) => {
    this.minutesElapsed++;
    this._completedPercent += step;
    this.draw(this._completedPercent);
  }

  draw(percent: number) {
    const circlePercent = (percent > 100) ? 100 : percent;
    const boxSize = 50;
    const radius = boxSize / 2;
    const startPoint = {x: 0, y: 0};
    const angleInDegrees = (circlePercent / 100) * 360;
    const mid = ( angleInDegrees > 180 ) ? 1 : 0;
    const endPoint = this.polarToCartesian(radius, angleInDegrees);

    this.svg = {
      d: `M ${startPoint.x} ${startPoint.y} v -${radius} A ${radius} ${radius} 1 ${mid} 1 ${endPoint.x}  ${endPoint.y} z`
    };
  }

  polarToCartesian = (radius, angleInDegrees) => {
    angleInDegrees %= 360;
    const angleInRadius = ( angleInDegrees * Math.PI / 180 );
    const x = Math.sin(angleInRadius) * radius;
    const y = Math.cos(angleInRadius) * radius * -1;
    return {x: x, y: y};
  }

  handleTimerStopped = () => {
    this.unsubscribeIfNeeded(this._timerSubscription);
    const delta = this.minutesElapsed - this._cachedTime;
    this.timerStopped.emit(delta);
    this._cachedTime = this.minutesElapsed;
  }

  resetTimer = () => {
    this._completedPercent = 0;
    this.inProgress = false;
    this.minutesElapsed = 0;
  }

}
