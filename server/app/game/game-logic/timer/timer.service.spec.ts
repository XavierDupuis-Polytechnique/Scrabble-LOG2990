// import { THOUSAND, THREE, TWO } from '@app/game/game-logic/constants';
// import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
// import { Timer } from '@app/game/game-logic/timer/timer.service';
// import { expect } from 'chai';
// import { delay } from 'rxjs';

// describe('TimerService', () => {
//     let service: Timer;

//     beforeEach(() => {
//         service = new Timer('gameToken', new TimerController());
//     });

//     it('should be created', () => {
//         expect(service).to.be.instanceOf(Timer);
//     });

//     it('should time the interval', () => {
//         const time = THOUSAND;
//         let timerDone = false;
//         const time$ = service.start(time);
//         time$.subscribe(() => {
//             timerDone = true;
//         });
//         delay(time / 2);
//         expect(timerDone).to.be.equal(false);
//         delay(time / 2);
//         expect(timerDone).to.be.equal(true);
//     });

//     it('should give time left', () => {
//         const time = 3000;
//         let timeLeft: number | undefined;
//         service.timeLeft$.subscribe((value: number | undefined) => {
//             timeLeft = value;
//         });
//         service.start(time);
//         expect(timeLeft).to.be.equal(time);
//         delay(THOUSAND);
//         expect(timeLeft).to.be.equal(TWO * THOUSAND);
//         delay(THOUSAND);
//         expect(timeLeft).to.be.equal(THOUSAND);
//         delay(THOUSAND);
//         expect(timeLeft).to.be.equal(0);
//     });

//     it('should stop', () => {
//         const time = 4000;
//         let timeLeft: number | undefined;
//         service.timeLeft$.subscribe((value: number | undefined) => {
//             timeLeft = value;
//         });
//         service.start(time);
//         expect(timeLeft).to.be.equal(time);
//         delay(THOUSAND);
//         expect(timeLeft).to.be.equal(THREE * THOUSAND);
//         service.stop();
//         delay(THOUSAND);
//         expect(timeLeft).to.be.equal(THREE * THOUSAND);
//     });
// });
