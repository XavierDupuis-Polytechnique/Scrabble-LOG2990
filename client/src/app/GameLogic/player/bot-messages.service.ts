import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';

const MAX_Y_VALUE = 14;
const MIN_Y_VALUE = 0;
const MAX_X_VALUE = 14;
const MIN_X_VALUE = 0;

export const placementSettingsToString = (placement: PlacementSetting): string => {
    const x = placement.x;
    const y = placement.y;
    const direction = placement.direction;
    if (x < MIN_X_VALUE || x > MAX_X_VALUE) {
        throw Error('X value not between 0-14');
    }

    if (y < MIN_Y_VALUE || y > MAX_Y_VALUE) {
        throw Error('Y value not between 0-14');
    }

    if (!Object.values(Direction).includes(direction as Direction)) {
        throw Error('Invalid direction');
    }

    const rowCode = 'a'.charCodeAt(0) + y;
    const row = String.fromCharCode(rowCode);

    const colNumber = x + 1;
    const col = colNumber.toString();

    const directionString = direction.toLowerCase();
    return `${row}${col}${directionString}`;
};

@Injectable({
    providedIn: 'root',
})
export class BotMessagesService {
    constructor(private messagesService: MessagesService) {}

    sendAction(action: Action) {
        const name = action.player.name;
        if (action instanceof PassTurn) {
            this.sendPassTurnMessage(name);
        }

        if (action instanceof ExchangeLetter) {
            const letters = action.lettersToExchange;
            this.sendExchangeLettersMessage(letters, name);
        }

        if (action instanceof PlaceLetter) {
            const placement = action.placement;
            const pickedWord = action.word;
            this.sendPlaceLetterMessage(pickedWord, placement, name);
        }
    }

    sendPlaceLetterMessage(pickedWord: string, placementSetting: PlacementSetting, name: string) {
        const placement = placementSettingsToString(placementSetting);
        const content = `${CommandType.Place} ${placement} ${pickedWord}`;
        this.messagesService.receiveMessage(name, content);
    }

    sendExchangeLettersMessage(letters: Letter[], name: string) {
        let lettersString = '';
        letters.forEach((letter) => {
            const charToExchange = letter.char.toLowerCase();
            lettersString = lettersString.concat(charToExchange);
        });
        const content = `${CommandType.Exchange} ${lettersString}`;
        this.messagesService.receiveMessage(name, content);
    }

    sendPassTurnMessage(name: string) {
        const content: string = CommandType.Pass;
        this.messagesService.receiveMessage(name, content);
    }
}
