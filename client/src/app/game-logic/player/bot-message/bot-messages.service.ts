import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { CommandType } from '@app/game-logic/commands/command.interface';
import { BINGO_MESSAGE, DEBUG_ALTERNATIVE_WORDS_COUNT, END_LINE } from '@app/game-logic/constants';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Bot } from '@app/game-logic/player/bot/bot';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { ValidWord } from '@app/game-logic/player/bot/valid-word';
import { placementSettingsToString } from '@app/game-logic/utils';

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
                if (action.player instanceof HardBot) {
                    this.sendNextBestWords((action.player as HardBot).bestWordList);
                    return;
                }
                this.sendAlternativeWords((action.player as Bot).validWordList);
            }
        }
    }

    private formatAlternativeWord(word: ValidWord): string {
        let posLetters = '';
        const formedWords: string[] = [];
        for (let wordIndex = 0; wordIndex < word.adjacentWords.length; wordIndex++) {
            const adjacentWord = word.adjacentWords[wordIndex];
            let formedWord = '';
            const formedWordIndexes = new Set<number>(adjacentWord.index);
            for (let index = 0; index < adjacentWord.letters.length; index++) {
                let currentChar = adjacentWord.letters[index].letterObject.char;
                if (formedWordIndexes.has(index)) {
                    currentChar = '#' + currentChar + '#';
                }
                formedWord = formedWord.concat(currentChar);
            }
            formedWord = formedWord.concat(' (' + word.value.wordsPoints[wordIndex].points + ') ');
            formedWords.push(formedWord);
        }
        let x = word.startingTileX;
        let y = word.startingTileY;
        for (const placedIndex of word.adjacentWords[0].index) {
            const placedChar = word.adjacentWords[0].letters[placedIndex].letterObject.char;
            [x, y] = word.isVertical ? [x, word.startingTileY + placedIndex] : [word.startingTileX + placedIndex, y];
            posLetters = posLetters.concat(String.fromCharCode(y + 'A'.charCodeAt(0)) + (x + 1) + ':' + placedChar + ' ');
        }
        let out = posLetters;
        out = out.concat('(' + word.value.totalPoints + ') ');
        out = out.concat(END_LINE);
        for (const formedWord of formedWords) {
            out = out.concat(formedWord);
            out = out.concat(END_LINE);
        }
        if (word.value.isBingo) {
            out = out.concat(BINGO_MESSAGE);
            out = out.concat(END_LINE);
        }
        out = out.concat(END_LINE);
        return out;
    }

    private sendAlternativeWords(validWordList: ValidWord[]) {
        let content = END_LINE;
        for (let i = 0; i < DEBUG_ALTERNATIVE_WORDS_COUNT; i++) {
            if (i === validWordList.length) {
                break;
            }
            const subMax = Math.ceil((validWordList.length * i) / DEBUG_ALTERNATIVE_WORDS_COUNT);
            const word = validWordList[subMax];
            content = content.concat(this.formatAlternativeWord(word));
        }
        this.messagesService.receiveSystemMessage(content);
    }

    private sendNextBestWords(bestWordList: ValidWord[]) {
        let content = END_LINE;
        for (let i = 1; i < bestWordList.length; i++) {
            const word = bestWordList[i];
            content = content.concat(this.formatAlternativeWord(word));
        }
        this.messagesService.receiveSystemMessage(content);
    }

    private sendPlaceLetterMessage(pickedWord: string, placementSetting: PlacementSetting, name: string) {
        const placement = placementSettingsToString(placementSetting);
        const content = `${CommandType.Place} ${placement} ${pickedWord}`;
        this.messagesService.receiveMessageOpponent(name, content);
    }

    private sendExchangeLettersMessage(letters: Letter[], name: string) {
        let lettersString = '';
        letters.forEach((letter) => {
            const charToExchange = letter.char.toLowerCase();
            lettersString = lettersString.concat(charToExchange);
        });
        const content = `${CommandType.Exchange} ${lettersString}`;
        this.messagesService.receiveMessageOpponent(name, content);
    }

    private sendPassTurnMessage(name: string) {
        const content: string = CommandType.Pass;
        this.messagesService.receiveMessageOpponent(name, content);
    }
}
