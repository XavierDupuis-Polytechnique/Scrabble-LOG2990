/* eslint-disable dot-notation */
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { OnlineAction, OnlineActionType } from '@app/game/online-action.interface';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';

describe('ActionCompilerService', () => {
    let actionCompiler: ActionCompilerService;
    let player: Player;
    const pointCalculator: PointCalculatorService = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const wordSearcher: WordSearcher = createSinonStubInstance<WordSearcher>(WordSearcher);

    beforeEach(() => {
        actionCompiler = new ActionCompilerService(pointCalculator, wordSearcher);
        player = new Player('p1');
    });

    it('should be created', () => {
        expect(actionCompiler).to.be.instanceOf(ActionCompilerService);
    });

    it('should throw error when given not action command', () => {
        const notActionCommands: OnlineAction[] = [{ type: 'debug' as OnlineActionType }, { type: 'help' as OnlineActionType }];
        for (const notActionCommand of notActionCommands) {
            expect(() => {
                actionCompiler.translate(notActionCommand, player);
            }).to.throw('this command dont generate an action');
        }
    });

    it('should create PassTurn object', () => {
        const command: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        const expectedAction = new PassTurn(player);
        const passTurnTest = actionCompiler.translate(command, player) as PassTurn;

        expect(passTurnTest.player).to.equal(expectedAction.player);
    });

    it('should create ExchangeLetter object', () => {
        const expectedPlayer: Player = new Player('p1');
        const playerLetters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'B', value: 3 },
            { char: 'B', value: 3 },
        ];

        expectedPlayer.letterRack = playerLetters;
        player.letterRack = playerLetters;

        const command: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters: 'abb',
            letterRack: playerLetters,
        };
        const expectedAction = new ExchangeLetter(expectedPlayer, playerLetters);
        const exchangeLetterTest = actionCompiler.translate(command, player) as ExchangeLetter;

        expect(actionCompiler.translate(command, player)).to.be.instanceOf(ExchangeLetter);
        expect(exchangeLetterTest.lettersToExchange).to.deep.equal(expectedAction.lettersToExchange);
        expect(exchangeLetterTest.player).to.deep.equal(expectedAction.player);
    });

    it('should create PlaceLetter object', () => {
        const playerLetters: Letter[] = [
            { char: 'D', value: 1 },
            { char: 'E', value: 3 },
            { char: 'F', value: 3 },
        ];
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'B', value: 3 },
            { char: 'C', value: 3 },
        ];
        player.letterRack = playerLetters;
        const placement: PlacementSetting = {
            x: 0,
            y: 0,
            direction: Direction.Horizontal,
        };
        const command: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: placement,
            letters: 'abc',
            letterRack: letters,
        };
        const expectedAction = new PlaceLetter(player, 'abc', placement, pointCalculator, wordSearcher);
        const placeLetterTest = actionCompiler.translate(command, player) as PlaceLetter;
        expect(actionCompiler.translate(command, player)).to.be.instanceOf(PlaceLetter);

        expect(placeLetterTest.placement).to.deep.equal(expectedAction.placement);
        expect(placeLetterTest.player).to.deep.equal(expectedAction.player);
        expect(placeLetterTest.word).to.deep.equal(expectedAction.word);
        expect(placeLetterTest.lettersToRemoveInRack).to.deep.equal(expectedAction.lettersToRemoveInRack);
    });

    it('should reattribute the rack', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];

        const playerLetters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        player.letterRack = playerLetters;

        const command: OnlineAction = {
            type: OnlineActionType.Pass,
            letterRack: letters,
        };

        actionCompiler['letterRackUpdateValidator'](command, player);
        expect(player.letterRack).to.be.equal(playerLetters);
    });

    it('should throw error when invalid command exchange', () => {
        let letters;
        const invalidCommand: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters,
        };
        expect(() => {
            actionCompiler.translate(invalidCommand, player);
        }).to.throw();
    });

    it('should throw error when invalid letters in command place', () => {
        const placement: PlacementSetting = {
            x: 0,
            y: 0,
            direction: Direction.Horizontal,
        };
        const letters: string[] = ['acb'];
        const invalidCommand: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: placement,
            letters: letters[2],
        };
        expect(() => {
            actionCompiler.translate(invalidCommand, player);
        }).to.throw('Argument of Action Invalid. Cant compile.');
    });

    it('should throw error when invalid settings command place', () => {
        const placement: PlacementSetting[] = [{ x: 1, y: 1, direction: Direction.Vertical }];
        const invalidCommand: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: placement[2],
            letters: 'letter',
        };
        expect(() => {
            actionCompiler.translate(invalidCommand, player);
        }).to.throw('Argument of Action Invalid. Cant compile.');
    });

    it('should command is not an action', () => {
        const notActionCommand: OnlineAction = {
            type: 'debug' as OnlineActionType,
        };

        expect(() => {
            actionCompiler.translate(notActionCommand, player);
        }).to.throw('this command dont generate an action');
    });

    it('should throw when args undefined exchange', () => {
        const command: OnlineAction = {
            type: OnlineActionType.Exchange,
        };

        expect(() => {
            actionCompiler.translate(command, player);
        }).to.throw();
    });

    it('should throw when args undefined placeletter', () => {
        const command: OnlineAction = {
            type: OnlineActionType.Place,
        };

        expect(() => {
            actionCompiler.translate(command, player);
        }).to.throw();
    });

    it('should throw when number of args not valid in placeletter', () => {
        const command: OnlineAction = {
            type: OnlineActionType.Place,
        };

        expect(() => {
            actionCompiler.translate(command, player);
        }).to.throw();
    });
});
