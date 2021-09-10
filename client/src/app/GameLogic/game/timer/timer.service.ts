import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';

const TIMER_STEP: number = 1000; // one second
@Injectable({
  providedIn: 'root'
})
export class TimerService {
  source: Observable<number>;
  readonly timePerStep: number = TIMER_STEP;

  constructor() { 
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
