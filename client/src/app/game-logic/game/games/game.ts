import { Player } from '@app/game-logic/player/player';
import { Observable } from 'rxjs';

export abstract class Game {
    players: Player[];
    activePlayerIndex: number;
    abstract get endTurn$(): Observable<void>;
    abstract getNumberOfLettersRemaining(): number;
    abstract start(): void;
    abstract getWinner(): Player[];
    abstract isEndOfGame(): boolean;
}
