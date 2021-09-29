import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BINGO_MESSAGE, BOARD_MAX_POSITION, BOARD_MIN_POSITION, DEBUG_ALTERNATIVE_WORDS_COUNT, RACK_LETTER_COUNT } from '@app/GameLogic/constants';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Bot } from '@app/GameLogic/player/bot';

export const placementSettingsToString = (placement: PlacementSetting): string => {
    const x = placement.x;
    const y = placement.y;
    const direction = placement.direction;
    if (x < BOARD_MIN_POSITION || x > BOARD_MAX_POSITION) {
        throw Error('X value not between 0-14');
    }

    if (y < BOARD_MIN_POSITION || y > BOARD_MAX_POSITION) {
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
    constructor(private messagesService: MessagesService, private commandExecuter: CommandExecuterService) {}

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
            if (this.commandExecuter.isDebugModeActivated) {
                this.sendAlternativeWords(action);
            }
        }
    }

    sendAlternativeWords(action: Action) {
        const bot = action.player as Bot;
        const validWordList = bot.validWordList;
        let content = '\\n';
        for (let i = 0; i < DEBUG_ALTERNATIVE_WORDS_COUNT; i++) {
            let posLetters = '';
            const formedWords: string[] = [];
            const word = validWordList[bot.getRandomInt(validWordList.length)];
            let x = word.startingTileX;
            let y = word.startingTileY;
            for (const adjacentWord of word.adjacentWords) {
                let formedWord = '';
                const formedWordIndexes = new Set<number>(adjacentWord.index);
                for (let index = 0; index < adjacentWord.letters.length; index++) {
                    let currentChar = adjacentWord.letters[index].letterObject.char;
                    if (formedWordIndexes.has(index)) {
                        currentChar = '#' + currentChar + '#';
                    }
                    formedWord = formedWord.concat(currentChar);
                }
                formedWords.push(formedWord);
            }
            for (const placedIndex of word.adjacentWords[0].index) {
                const placedChar = word.adjacentWords[0].letters[placedIndex].letterObject.char;
                if (word.isVertical) {
                    y = word.startingTileY + placedIndex;
                } else {
                    x = word.startingTileX + placedIndex;
                }
                posLetters = posLetters.concat(String.fromCharCode(y + 'A'.charCodeAt(0)) + (x + 1) + ':' + placedChar + ' ');
            }
            content = content.concat(posLetters);
            content = content.concat(' (' + word.value + ') ');
            content = content.concat('\\n');
            for (const formedWord of formedWords) {
                content = content.concat(formedWord);
                content = content.concat('\\n');
            }
            if (word.numberOfLettersPlaced === RACK_LETTER_COUNT) {
                content = content.concat(BINGO_MESSAGE);
                content = content.concat('\\n');
            }
            content = content.concat('\\n');
        }
        this.messagesService.receiveSystemMessage(content);
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
