import { TimerControls } from '@app/game/game-logic/timer/timer-controls.enum';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

@Service()
export class TimerController {
    private timerControlSubject = new Subject<TimerGameControl>();
    get timerControl$(): Observable<TimerGameControl> {
        return this.timerControlSubject;
    }

    startClientTimers(gameToken: string) {
        const timerGameControl: TimerGameControl = {
            gameToken,
            control: TimerControls.Start,
        };
        this.timerControlSubject.next(timerGameControl);
    }

    stopClientTimers(gameToken: string) {
        const timerGameControl: TimerGameControl = {
            gameToken,
            control: TimerControls.Stop,
        };
        this.timerControlSubject.next(timerGameControl);
    }
}
