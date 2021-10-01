import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const TIMER_STEP = 1000; // one second
@Injectable({
    providedIn: 'root',
})
export class TimerService {
    source: Observable<number>;
    readonly timePerStep: number = TIMER_STEP;
    private end$$: Subscription;
    private timeLeftSubject = new BehaviorSubject<number | undefined>(undefined);

    start(interval: number) {
        const end$: Subject<void> = new Subject();
        const numberOfStep = Math.ceil(interval / TIMER_STEP);

        this.timeLeftSubject.next(interval);
        this.source = timer(TIMER_STEP, TIMER_STEP);
        this.end$$ = this.source.pipe(takeUntil(end$)).subscribe((step) => {
            const timeLeft = interval - (step + 1) * this.timePerStep;
            this.timeLeftSubject.next(timeLeft);
            if (step >= numberOfStep - 1) {
                end$.next();
                end$.complete();
            }
        });
        return end$;
    }

    stop() {
        this.end$$.unsubscribe();
        this.source = new Subject();
    }

    get timeLeft$(): Observable<number | undefined> {
        return this.timeLeftSubject;
    }
}
