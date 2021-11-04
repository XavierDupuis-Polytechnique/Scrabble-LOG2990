import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { DEBUG_MESSAGE_ACTIVATED, DEBUG_MESSAGE_DEACTIVATED, END_LINE, RESERVE_NOT_ACCESSIBLE } from '@app/GameLogic/constants';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
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

    execute(command: Command) {
        const type = command.type;
        if (type === CommandType.Debug) {
            this.executeDebug();
            return;
        }

        if (type === CommandType.Reserve) {
            if (this.debugMode) {
                this.executeReserve();
            } else {
                this.messageService.receiveErrorMessage(RESERVE_NOT_ACCESSIBLE);
            }
        }

        if (type === CommandType.Help) {
            return;
        }

        if (type === CommandType.Exchange || type === CommandType.Pass || type === CommandType.Place) {
            try {
                const action = this.actionCompilerService.translate(command);
                this.sendAction(action);
                // eslint-disable-next-line no-empty
            } catch (e) {}
        }
    }
    private executeReserve() {
        if (this.gameInfo.isOnlineGame) {
            this.showLetterBagOnline();
        } else {
            this.showLetterBag();
        }
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
        this.http.get(`${environment.serverUrl}/servergame/letterbag?gameId=${this.gameInfo.gameId}`).subscribe((data) => {
            const letterOccurences = Object.entries(data);
            let stringOccurences = '';
            for (const letterOccurence of letterOccurences) {
                const letter = letterOccurence[0];
                const occurence = letterOccurence[1];
                stringOccurences = stringOccurences.concat(`${letter} : ${occurence}${END_LINE}`);
            }
            this.messageService.receiveSystemMessage(`Reserve:${END_LINE}${stringOccurences}`);
        });
    }

    private executeDebug() {
        this.debugMode = !this.debugMode;
        if (this.debugMode) {
            this.messageService.receiveSystemMessage(DEBUG_MESSAGE_ACTIVATED);
        } else {
            this.messageService.receiveSystemMessage(DEBUG_MESSAGE_DEACTIVATED);
        }
    }

    private sendAction(action: Action) {
        this.actionValidator.sendAction(action);
    }
}
