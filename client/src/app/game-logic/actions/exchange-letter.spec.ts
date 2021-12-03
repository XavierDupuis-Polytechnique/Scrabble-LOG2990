import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';

describe('ExchangeLetter', () => {
    let game: OfflineGame;
    const player: Player = new User('Tim');
    const randomBonus = false;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [{ provide: DictionaryService, useValue: dict }] });
        const messageService = TestBed.inject(MessagesService);
        const timerService = TestBed.inject(TimerService);
        const pointCalulatorService = TestBed.inject(PointCalculatorService);
        const boardService = TestBed.inject(BoardService);
        game = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timerService, pointCalulatorService, boardService, messageService);
        game.players[0] = player;
        game.start();
    });

    it('should create an instance', () => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        expect(new ExchangeLetter(new User('Tim'), letters)).toBeTruthy();
    });

    it('letter rack should be different when exchanging letters', () => {
        const initialLetterRack: Letter[] = [...player.letterRack];
        const lettersToExchange: Letter[] = initialLetterRack.slice(0, 3);
        const exchangeAction = new ExchangeLetter(player, lettersToExchange);

        exchangeAction.execute(game);

        const finalLetterRack: Letter[] = player.letterRack;
        initialLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));
        finalLetterRack.sort((a, b) => a.char.charCodeAt(0) - b.char.charCodeAt(0));

        expect(initialLetterRack !== finalLetterRack).toBeTrue();
    });
});
