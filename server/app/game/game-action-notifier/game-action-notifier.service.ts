import { Action } from '@app/game/game-logic/actions/action';
import { ExchangeLetter } from '@app/game/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { BindedSocket } from '@app/game/game-manager/binded-client.interface';
import { Subject } from 'rxjs';
import { Service } from 'typedi';

export interface GameActionNotification {
    gameToken: string;
    content: string;
    to: string[]; // player names
}

@Service()
export class GameActionNotifierService {
    notification$: Subject<GameActionNotification> = new Subject<GameActionNotification>();

    notify(action: Action, linkedClients: BindedSocket[], gameToken: string): void {
        if (action instanceof ExchangeLetter) {
            this.notifyExchangeLetter(action, linkedClients, gameToken);
        }

        if (action instanceof PlaceLetter) {
            this.notifyPlaceLetter(action, linkedClients, gameToken);
        }

        if (action instanceof PassTurn) {
            this.notifyPassTurn(action, linkedClients, gameToken);
        }
    }

    private findOpponentName(playerName: string, linkedClients: BindedSocket[]): string {
        const opponentClient = linkedClients.find((client) => client.name !== playerName);
        if (!opponentClient) {
            throw Error(`No opponent found for ${playerName}`);
        }
        return opponentClient.name;
    }

    private notifyExchangeLetter(exchangeLetter: ExchangeLetter, linkedClients: BindedSocket[], gameToken: string) {
        const player = exchangeLetter.player;
        const lettersToExchange = exchangeLetter.lettersToExchange;
        const content = `${player.name} échange ${lettersToExchange.length} lettres`;
        const to = [this.findOpponentName(player.name, linkedClients)];
        const notification: GameActionNotification = { gameToken, content, to };
        this.notification$.next(notification);
    }

    private notifyPlaceLetter(placeLetter: PlaceLetter, linkedClients: BindedSocket[], gameToken: string) {
        const player = placeLetter.player;
        const word = placeLetter.word;
        const content = `${player.name} place le mot ${word}`;
        const to = [this.findOpponentName(player.name, linkedClients)];
        const notification: GameActionNotification = { gameToken, content, to };
        this.notification$.next(notification);
    }

    private notifyPassTurn(passTurn: PassTurn, linkedClients: BindedSocket[], gameToken: string) {
        const player = passTurn.player;
        const content = `${player.name} passe son tour`;
        const to = [this.findOpponentName(player.name, linkedClients)];
        const notification: GameActionNotification = { gameToken, content, to };
        this.notification$.next(notification);
    }
}
