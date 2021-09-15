import { TestBed } from '@angular/core/testing';
import { GameManagerService } from '../game/games/game-manager.service';
import { GameSettings } from '../game/games/game-settings.interface';
import { TimerService } from '../game/timer/timer.service';
import { PointCalculatorService } from '../point-calculator/point-calculator.service';
import { ActionValidatorService } from './action-validator.service';

describe('ActionValidatorService', () => {
    let service: ActionValidatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActionValidatorService);
        const gms = new GameManagerService(new TimerService(), new PointCalculatorService());
        const sgs: GameSettings = { timePerTurn: 30000, playerName: 'testPlayer', botDifficulty: 'easy' };
        gms.createGame(sgs);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});

/*
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    private simulatePlayerInput(g: Game) {
        const fakeLetter = { char: 'A', value: 1 };
        g.getActivePlayer().letterRack[0] = fakeLetter;
        const exchangeLetterAction = new ExchangeLetter(g.getActivePlayer(), [fakeLetter]);
        const passTurnAction = new PassTurn(g.getActivePlayer());
        if (this.getRandomInt(2) === 1) {
            console.log('exchangeLetterAction ', exchangeLetterAction.id);
            g.avs.validateAction(exchangeLetterAction, g);
        } else {
            console.log('passTurnAction ', exchangeLetterAction.id);
            g.avs.validateAction(passTurnAction, g);
        }
    }

            setTimeout(() => {
                this.simulatePlayerInput(this);
            }, 2500);
*/
