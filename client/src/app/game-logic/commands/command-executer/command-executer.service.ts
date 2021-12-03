import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ActionValidatorService } from '@app/game-logic/actions/action-validator/action-validator.service';
import { ActionCompilerService } from '@app/game-logic/commands/action-compiler/action-compiler.service';
import { CommandParserService } from '@app/game-logic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import {
    DEBUG_MESSAGE_ACTIVATED,
    DEBUG_MESSAGE_DEACTIVATED,
    END_LINE,
    ERROR_GET_REQUEST_DEBUG,
    HELP,
    RESERVE_NOT_ACCESSIBLE,
} from '@app/game-logic/constants';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommandExecuterService {
    private debugMode = false;
    get isDebugModeActivated() {
        return this.debugMode;
    }

    constructor(
        private commandParser: CommandParserService,
        private actionCompilerService: ActionCompilerService,
        private actionValidator: ActionValidatorService,
        private messageService: MessagesService,
        private gameInfo: GameInfoService,
        private http: HttpClient,
    ) {
        this.commandParser.parsedCommand$.subscribe((command) => {
            this.execute(command);
        });
    }

    resetDebug() {
        this.debugMode = false;
    }

    private execute(command: Command) {
        const type = command.type;
        if (type === CommandType.Debug) {
            this.executeDebug();
            return;
        }

        if (type === CommandType.Reserve) {
            if (this.debugMode) {
                this.executeReserve();
                return;
            }
            this.messageService.receiveErrorMessage(RESERVE_NOT_ACCESSIBLE);
            return;
        }

        if (type === CommandType.Help) {
            this.executeAide();
            return;
        }

        if (type === CommandType.Exchange || type === CommandType.Pass || type === CommandType.Place) {
            try {
                const action = this.actionCompilerService.translate(command);
                this.sendAction(action);
            } catch (e) {
                return;
            }
        }
    }

    private executeReserve() {
        if (this.gameInfo.isOnlineGame) {
            this.showLetterBagOnline();
            return;
        }
        this.showLetterBag();
    }

    private showLetterBag() {
        const letterOccurences = this.gameInfo.letterOccurences;
        let stringOccurences = '';
        for (const letterOccurence of letterOccurences) {
            const letter = letterOccurence[0];
            const occurence = letterOccurence[1];
            stringOccurences = stringOccurences.concat(`${letter} : ${occurence}${END_LINE}`);
        }
        this.messageService.receiveSystemMessage(`Reserve:${END_LINE}${stringOccurences}`);
    }

    private showLetterBagOnline() {
        this.http.get(`${environment.serverUrl}/servergame/letterbag?gameId=${this.gameInfo.gameId}`).subscribe(
            (data) => {
                const letterOccurences = Object.entries(data);
                let stringOccurences = '';
                for (const letterOccurence of letterOccurences) {
                    const letter = letterOccurence[0];
                    const occurence = letterOccurence[1];
                    stringOccurences = stringOccurences.concat(`${letter} : ${occurence}${END_LINE}`);
                }
                this.messageService.receiveSystemMessage(`Reserve:${END_LINE}${stringOccurences}`);
            },
            () => {
                this.messageService.receiveSystemMessage(ERROR_GET_REQUEST_DEBUG);
            },
        );
    }

    private executeDebug() {
        this.debugMode = !this.debugMode;
        if (this.debugMode) {
            this.messageService.receiveSystemMessage(DEBUG_MESSAGE_ACTIVATED);
            return;
        }
        this.messageService.receiveSystemMessage(DEBUG_MESSAGE_DEACTIVATED);
    }

    private sendAction(action: Action) {
        this.actionValidator.sendAction(action);
    }

    private executeAide() {
        this.messageService.receiveSystemMessage(HELP);
    }
}
