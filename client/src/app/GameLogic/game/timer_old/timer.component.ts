import { Component, OnInit } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

const TIMER_STEP: number = 1000; // one second
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  source: Observable<number>;
  readonly timePerStep: number = TIMER_STEP;

  constructor() { 
  }

  ngOnInit(): void {
  }

  start(interval: number) {
    const end$: Subject<void> = new Subject();
    const numberOfStep = Math.ceil(interval/TIMER_STEP);
    this.source = timer(TIMER_STEP, TIMER_STEP);
    this.source.subscribe(step => {
      if (step == numberOfStep) {
        end$.next();
      }
    })
    return end$
  }

}
