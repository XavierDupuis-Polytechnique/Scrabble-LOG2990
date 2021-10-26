import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { THOUSAND, THREE, TWO } from '@app/GameLogic/constants';
import { TimerService } from './timer.service';

describe('TimerService', () => {
    let service: TimerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should time the interval', fakeAsync(() => {
        const time = THOUSAND;
        let timerDone = false;
        const time$ = service.start(time);
        time$.subscribe(() => {
            timerDone = true;
        });
        tick(time / 2);
        expect(timerDone).toBeFalsy();
        tick(time / 2);
        expect(timerDone).toBeTruthy();
    }));

    it('should give time left', fakeAsync(() => {
        const time = 3000;
        let timeLeft: number | undefined;
        service.timeLeft$.subscribe((value: number | undefined) => {
            timeLeft = value;
        });
        service.start(time);
        expect(timeLeft).toBe(time);
        tick(THOUSAND);
        expect(timeLeft).toBe(TWO * THOUSAND);
        tick(THOUSAND);
        expect(timeLeft).toBe(THOUSAND);
        tick(THOUSAND);
        expect(timeLeft).toBe(0);
    }));

    it('should stop', fakeAsync(() => {
        const time = 4000;
        let timeLeft: number | undefined;
        service.timeLeft$.subscribe((value) => {
            timeLeft = value;
        });
        service.start(time);
        expect(timeLeft).toBe(time);
        tick(THOUSAND);
        expect(timeLeft).toBe(THREE * THOUSAND);
        service.stop();
        tick(THOUSAND);
        expect(timeLeft).toBe(THREE * THOUSAND);
    }));
});
