import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';

const DEBUG_MESSAGE_ACTIVATED = 'affichages de débogage activés';
const DEBUG_MESSAGE_DEACTIVATED = 'affichages de débogage déactivés';
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
    ) {
        console.log('command executer is created');
        this.commandParser.parsedCommand$.subscribe((command) => {
            console.log('received command', command);
            this.execute(command);
        });
    }

    execute(command: Command) {
        const type = command.type;
        if (type === CommandType.Debug) {
            this.executeDebug();
            return;
        }

        if (type === CommandType.Help) {
            return;
        }

        if (type === CommandType.Exchange || type === CommandType.Pass || type === CommandType.Place) {
            try {
                const action = this.actionCompilerService.translate(command);
                this.sendAction(action);
            } catch (e) {
                // TODO: message service error
            }
            // TODO: Compile action with action compiler
            // send action to action validator
        }
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
        try {
            this.actionValidator.validateAction(action);
        } catch (e) {
            this.messageService.receiveError(e as Error);
        }
    }
}
