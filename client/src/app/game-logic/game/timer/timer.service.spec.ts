/* eslint-disable @typescript-eslint/no-magic-numbers */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { first } from 'rxjs/operators';
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
        const time = 1000;
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
        tick(1000);
        expect(timeLeft).toBe(2000);
        tick(1000);
        expect(timeLeft).toBe(1000);
        tick(1000);
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
        tick(1000);
        expect(timeLeft).toBe(3000);
        service.stop();
        tick(1000);
        expect(timeLeft).toBe(3000);
    }));

    it('should return undefined percentage when the timer is not started', (done) => {
        service.timeLeftPercentage$.pipe(first()).subscribe((val) => {
            expect(val).toBeUndefined();
            done();
        });
    });

    it('should return the correct percentage when the timer is started', fakeAsync(() => {
        const time = 4000;
        let percentage: number | undefined;
        service.timeLeftPercentage$.subscribe((val) => {
            percentage = val;
        });
        service.start(time);
        expect(percentage).toBe(1);
        tick(1000);
        expect(percentage).toBe(0.75);
        tick(1000);
        expect(percentage).toBe(0.5);
        tick(1000);
        expect(percentage).toBe(0.25);
        tick(1000);
        expect(percentage).toBe(0);
    }));
});
