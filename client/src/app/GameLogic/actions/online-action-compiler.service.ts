import { Injectable } from '@angular/core';
import { Action } from './action';
import { ActionValidatorService } from './action-validator.service';
import { ExchangeLetter } from './exchange-letter';
import { OnlineAction, OnlineActionType } from './online-action-compiler.interface';
import { PassTurn } from './pass-turn';
import { PlaceLetter } from './place-letter';

@Injectable({
    providedIn: 'root',
})
export class OnlineActionCompilerService {
    constructor(private actionValidator: ActionValidatorService) {}

    compileActionOnline(action: Action) {
        if (!this.actionValidator.validateAction(action)) {
            return;
        }
        if (action instanceof PlaceLetter) {
            this.compilePlaceLetterOnline(action);
        }

        if (action instanceof ExchangeLetter) {
            this.compileExchangeLetterOnline(action);
        }

        if (action instanceof PassTurn) {
            this.compilePassTurnOnline();
        }
    }

    compilePlaceLetterOnline(action: PlaceLetter): OnlineAction {
        const onlinePlaceLetter: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: action.placement,
            letters: action.word,
        };
        return onlinePlaceLetter;
    }

    compileExchangeLetterOnline(action: ExchangeLetter): OnlineAction {
        let lettersToExchange = '';
        action.lettersToExchange.forEach((letter) => {
            lettersToExchange += letter.char;
        });
        const onlineExchangeLetter: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters: lettersToExchange,
        };
        return onlineExchangeLetter;
    }

    compilePassTurnOnline(): OnlineAction {
        const passTurn: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        return passTurn;
    }
}
