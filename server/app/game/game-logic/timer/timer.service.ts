import { TIMER_STEP } from '@app/game/game-logic/constants';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class Timer {
    source: Observable<number>;
    readonly timePerStep: number = TIMER_STEP;
    private end$$: Subscription;
    private timeLeftSubject = new BehaviorSubject<number | undefined>(undefined);

    constructor(private gameToken: string, private timerController: TimerController) {}

    start(interval: number) {
        this.emitStartControl();
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
        this.emitStopControl();
        this.end$$.unsubscribe();
        this.source = new Subject();
    }

    private emitStartControl() {
        this.timerController.startClientTimers(this.gameToken);
    }

    private emitStopControl() {
        this.timerController.stopClientTimers(this.gameToken);
    }

    get timeLeft$(): Observable<number | undefined> {
        return this.timeLeftSubject;
    }
}
