import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { TimerControls } from '@app/game/game-logic/timer/timer-controls.enum';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { expect } from 'chai';

describe('TimerController', () => {
    let service: TimerController;
    beforeEach(() => {
        service = new TimerController();
    });

    it('should start client timers', () => {
        const gameToken = '1';
        const control: TimerGameControl = {
            gameToken,
            control: TimerControls.Start,
        };
        service.timerControl$.subscribe((receivedControl) => {
            expect(receivedControl).to.be.deep.equal(control);
        });
        service.startClientTimers(gameToken);
    });

    it('should stop client timers', () => {
        const gameToken = '1';
        const control: TimerGameControl = {
            gameToken,
            control: TimerControls.Stop,
        };
        service.timerControl$.subscribe((receivedControl) => {
            expect(receivedControl).to.be.deep.equal(control);
        });
        service.stopClientTimers(gameToken);
    });
});
