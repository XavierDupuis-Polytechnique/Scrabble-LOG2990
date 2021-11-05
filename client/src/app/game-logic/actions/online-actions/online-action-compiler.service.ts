import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { OnlineAction, OnlineActionType } from '@app/socket-handler/interfaces/online-action.interface';

@Injectable({
    providedIn: 'root',
})
export class OnlineActionCompilerService {
    compileActionOnline(action: Action): OnlineAction | undefined {
        if (action instanceof PlaceLetter) {
            return this.compilePlaceLetterOnline(action);
        }

        if (action instanceof ExchangeLetter) {
            return this.compileExchangeLetterOnline(action);
        }

        if (action instanceof PassTurn) {
            return this.compilePassTurnOnline(action);
        }
        return undefined;
    }

    private compilePlaceLetterOnline(action: PlaceLetter): OnlineAction {
        const onlinePlaceLetter: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: action.placement,
            letters: action.word,
            letterRack: action.player.letterRack,
        };
        return onlinePlaceLetter;
    }

    private compileExchangeLetterOnline(action: ExchangeLetter): OnlineAction {
        let lettersToExchange = '';
        action.lettersToExchange.forEach((letter) => {
            lettersToExchange += letter.char;
        });
        const onlineExchangeLetter: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters: lettersToExchange,
            letterRack: action.player.letterRack,
        };
        return onlineExchangeLetter;
    }

    private compilePassTurnOnline(action: PassTurn): OnlineAction {
        const passTurn: OnlineAction = {
            type: OnlineActionType.Pass,
            letterRack: action.player.letterRack,
        };
        return passTurn;
    }
}
