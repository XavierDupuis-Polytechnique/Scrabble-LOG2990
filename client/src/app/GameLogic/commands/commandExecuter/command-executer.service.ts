import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { ActionCompilerService } from '@app/GameLogic/commands/commandTranslator/action-compiler.service';

@Injectable({
    providedIn: 'root',
})
export class CommandExecuterService {
    private debugMode = false;
    get isDebugModeActivated() {
        return this.debugMode;
    }

    constructor(private actionCompilerService: ActionCompilerService) {}

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
                console.error(e);
            }
            // TODO: Compile action with action compiler
            // send action to action validator
        }
    }

    private executeDebug() {
        return;
    }

    private sendAction(action: Action) {
        return;
    }
}
