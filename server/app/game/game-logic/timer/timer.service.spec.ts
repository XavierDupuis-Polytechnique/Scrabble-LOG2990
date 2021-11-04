/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { Timer } from '@app/game/game-logic/timer/timer.service';
import { expect } from 'chai';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

describe('TimerService', () => {
    let service: Timer;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        service = new Timer('gameToken', new TimerController());
        clock = useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should be created', () => {
        expect(service).to.be.instanceOf(Timer);
    });

    it('should time the interval', async () => {
        const time = 1000;
        let timerDone = false;
        const time$ = service.start(time);
        time$.subscribe(() => {
            timerDone = true;
        });
        useFakeTimers();
        clock.tick(time / 2);
        expect(timerDone).to.be.equal(false);
        clock.tick(time / 2);
        expect(timerDone).to.be.equal(true);
    });

    it('should give time left', async () => {
        const time = 3000;
        let timeLeft: number | undefined;
        service.timeLeft$.subscribe((value: number | undefined) => {
            timeLeft = value;
        });
        service.start(time);
        expect(timeLeft).to.be.equal(time);
        clock.tick(1000);
        expect(timeLeft).to.be.equal(2000);
        clock.tick(1000);
        expect(timeLeft).to.be.equal(1000);
        clock.tick(1000);
        expect(timeLeft).to.be.equal(0);
    });

    it('should stop', async () => {
        const time = 4000;
        let timeLeft: number | undefined;
        service.timeLeft$.subscribe((value: number | undefined) => {
            timeLeft = value;
        });
        service.start(time);
        expect(timeLeft).to.be.equal(time);
        clock.tick(1000);
        expect(timeLeft).to.be.equal(3000);
        service.stop();
        clock.tick(1000);
        expect(timeLeft).to.be.equal(3000);
    });
});
