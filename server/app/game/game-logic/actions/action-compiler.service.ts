import { Action } from '@app/game/game-logic/actions/action';
import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { OnlineAction, OnlineActionType } from '@app/game/online-action.interface';
import { Service } from 'typedi';

@Service()
export class ActionCompilerService {
    private letterFactory: LetterCreator = new LetterCreator();

    constructor(private pointCalculator: PointCalculatorService, private wordSearcher: WordSearcher) {}

    translate(command: OnlineAction, player: Player): Action {
        switch (command.type) {
            case OnlineActionType.Exchange: {
                const letters = command.letters;
                if (!letters) {
                    throw Error('Argument of Action Invalid. Cant compile.');
                }
                const lettersToExchange: Letter[] = this.letterFactory.createLetters(letters.split(''));
                this.letterRackUpdateValidator(command, player);
                return new ExchangeLetter(player, lettersToExchange);
            }

            case OnlineActionType.Pass:
                this.letterRackUpdateValidator(command, player);
                return new PassTurn(player);

            case OnlineActionType.Place: {
                const settings = command.placementSettings;
                const letters = command.letters;
                if (!letters) {
                    throw Error('Argument of Action Invalid. Cant compile.');
                }
                if (!settings) {
                    throw Error('Argument of Action Invalid. Cant compile.');
                }
                this.letterRackUpdateValidator(command, player);
                return new PlaceLetter(player, letters, settings, this.pointCalculator, this.wordSearcher);
            }

            default:
                throw Error('this command dont generate an action');
        }
    }

    private letterRackUpdateValidator(command: OnlineAction, player: Player) {
        const newLetterRack = command.letterRack as Letter[];
        if (!newLetterRack) {
            return;
        }
        if (!this.isLetterRackChanged(newLetterRack, player)) {
            for (let letterIndex = 0; letterIndex < newLetterRack.length; letterIndex++) {
                player.letterRack[letterIndex] = newLetterRack[letterIndex];
            }
        }
    }

    private isLetterRackChanged(newLetterRack: Letter[], player: Player): boolean {
        const mapRack = this.makeLetterRackMap(newLetterRack);
        let isChanged = false;

        for (const letter of player.letterRack) {
            const letterCount = mapRack.get(letter.char);
            if (letterCount === 0 || letterCount === undefined) {
                isChanged = true;
                return isChanged;
            }
            mapRack.set(letter.char, letterCount - 1);
        }

        return isChanged;
    }

    private makeLetterRackMap(letterRack: Letter[]): Map<string, number> {
        const mapRack = new Map<string, number>();
        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter.char);
            if (letterCount !== undefined) {
                mapRack.set(letter.char, letterCount + 1);
            } else {
                mapRack.set(letter.char, 1);
            }
        }
        return mapRack;
    }
}
