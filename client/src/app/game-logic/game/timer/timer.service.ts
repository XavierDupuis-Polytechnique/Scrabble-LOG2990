import { Injectable } from '@angular/core';
import { TIMER_STEP } from '@app/game-logic/constants';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    source: Observable<number>;
    isStarted = false;
    readonly timePerStep: number = TIMER_STEP;
    private end$$: Subscription;
    private timeLeftSubject = new BehaviorSubject<number | undefined>(undefined);
    private interval: number;

    start(interval: number) {
        this.end$$?.unsubscribe();
        const end$: Subject<void> = new Subject();
        const numberOfStep = Math.ceil(interval / TIMER_STEP);

        this.isStarted = true;
        this.interval = interval;

        this.timeLeftSubject.next(interval);
        this.source = timer(TIMER_STEP, TIMER_STEP);
        this.end$$ = this.source.pipe(takeUntil(end$)).subscribe((step) => {
            const timeLeft = interval - (step + 1) * this.timePerStep;
            this.timeLeftSubject.next(timeLeft);
            if (step >= numberOfStep - 1) {
                this.isStarted = false;
                end$.next();
                end$.complete();
            }
        });
        return end$;
    }

    stop() {
        this.end$$?.unsubscribe();
        this.source = new Subject();
    }

    get timeLeft$(): Observable<number | undefined> {
        return this.timeLeftSubject;
    }

    get timeLeftPercentage$(): Observable<number | undefined> {
        return this.timeLeftSubject.pipe(
            map((timerLeft: number | undefined): number | undefined => {
                if (timerLeft === undefined || this.interval === undefined) {
                    return undefined;
                }
                return timerLeft / this.interval;
            }),
        );
    }
}
