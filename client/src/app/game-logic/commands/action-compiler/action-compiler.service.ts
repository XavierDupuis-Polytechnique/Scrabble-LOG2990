import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import { Direction } from '@app/game-logic/direction.enum';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

@Injectable({
    providedIn: 'root',
})
export class ActionCompilerService {
    private letterFactory: LetterCreator = new LetterCreator();

    constructor(private gameInfo: GameInfoService, private pointCalculator: PointCalculatorService, private wordSearcher: WordSearcher) {}

    translate(command: Command): Action {
        const user = this.findPlayer(command.from);
        const args = command.args;
        switch (command.type) {
            case CommandType.Exchange:
                return this.createExchangeLetter(user, args);

            case CommandType.Pass:
                return this.createPassTurn(user);

            case CommandType.Place:
                return this.createPlaceLetter(user, args);
            default:
                throw Error('this command dont generate an action');
        }
    }

    private createPassTurn(user: User): PassTurn {
        return new PassTurn(user);
    }

    private createExchangeLetter(user: User, args: string[] | undefined): ExchangeLetter {
        if (!args) {
            throw new Error('No argument was given for exchange letter creation');
        }
        const letters = args[0].split('');
        const lettersToExchange: Letter[] = this.letterFactory.createLetters(letters);
        return new ExchangeLetter(user, lettersToExchange);
    }

    private createPlaceLetter(user: User, args: string[] | undefined) {
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
        return new PlaceLetter(user, word, placementSettings, this.pointCalculator, this.wordSearcher);
    }

    private createPlacementSettings(placementArgs: string[]): PlacementSetting {
        const xString = placementArgs[1];
        const x = Number.parseInt(xString, 10) - 1;
        const y = placementArgs[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const direction = placementArgs[2].toUpperCase() as Direction;
        return { x, y, direction };
    }

    private findPlayer(name: string): Player {
        const players = this.gameInfo.players;
        for (const player of players) {
            if (player.name === name) {
                return player;
            }
        }
        throw Error(`${name} not found in players`);
    }
}
