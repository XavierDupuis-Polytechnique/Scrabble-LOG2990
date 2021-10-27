import { Action } from '@app/game/game-logic/actions/action';
import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { OnlineActionType } from '@app/game/online-action.enum';
import { OnlineAction } from '@app/game/online-action.interface';
import { Service } from 'typedi';

@Service()
export class ActionCompilerService {
    private letterFactory: LetterCreator = new LetterCreator();

    constructor(private pointCalculator: PointCalculatorService, private wordSearcher: WordSearcher) {}

    translate(command: OnlineAction, player: Player): Action {
        const args = command.args;
        switch (command.type) {
            case OnlineActionType.Exchange:
                return this.createExchangeLetter(player, args);

            case OnlineActionType.Pass:
                return this.createPassTurn(player);

            case OnlineActionType.Place:
                return this.createPlaceLetter(player, args);
            default:
                throw Error('this command dont generate an action');
        }
    }

    private createPassTurn(player: Player): PassTurn {
        return new PassTurn(player);
    }

    private createExchangeLetter(player: Player, args: string[] | undefined): ExchangeLetter {
        if (!args) {
            throw new Error('No argument was given for exchange letter creation');
        }
        const letters = args[0].split('');
        const lettersToExchange: Letter[] = this.letterFactory.createLetters(letters);
        return new ExchangeLetter(player, lettersToExchange);
    }

    private createPlaceLetter(player: Player, args: string[] | undefined) {
        if (!args) {
            throw Error('No argument was given for place letter creation');
        }
        const PLACE_LETTER_ARGS_LENGTH = 4;
        if (args.length !== PLACE_LETTER_ARGS_LENGTH) {
            throw Error('Invalid number of arguments');
        }
        const placementArguments = args.slice(0, args.length - 1);
        const placementSettings = this.createPlacementSettings(placementArguments);
        const word = args[args.length - 1];
        return new PlaceLetter(player, word, placementSettings, this.pointCalculator, this.wordSearcher);
    }

    private createPlacementSettings(placementArgs: string[]): PlacementSetting {
        const xString = placementArgs[1];
        const x = Number.parseInt(xString, 10) - 1;
        const y = placementArgs[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const direction = placementArgs[2].toUpperCase();
        return { x, y, direction };
    }
}
