import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const TIMER_STEP = 1000; // one second
@Injectable({
    providedIn: 'root',
})
export class TimerService {
    source: Observable<number>;
    readonly timePerStep: number = TIMER_STEP;
    private end$$: Subscription;
    private timeLeftSubject: Subject<number> = new Subject();

    start(interval: number) {
        // console.log('start timer');
        const end$: Subject<void> = new Subject();
        const numberOfStep = Math.ceil(interval / TIMER_STEP);
        this.source = timer(TIMER_STEP, TIMER_STEP);
        this.end$$ = this.source.pipe(takeUntil(end$)).subscribe((step) => {
            const timeLeft = interval - (step + 1) * this.timePerStep;
            this.timeLeftSubject.next(timeLeft);
            // console.log((step + 1) * this.timePerStep);
            if (step >= numberOfStep - 1) {
                end$.next();
                end$.complete();
            }
        });
        return end$;
    }

    stop() {
        this.end$$.unsubscribe();
    }

    get timeLeft$(): Observable<number> {
        return this.timeLeftSubject;
    }
}
