import { Player } from '@app/game-logic/player/player';
import { Observable, Subject } from 'rxjs';

export abstract class Game {
    players: Player[];
    activePlayerIndex: number;
    protected isEndOfGameSubject = new Subject<void>();
    protected endTurnSubject = new Subject<void>();
    get endTurn$(): Observable<void> {
        return this.endTurnSubject;
    }
    get isEndOfGame$(): Observable<void> {
        return this.isEndOfGameSubject;
    }
    abstract getNumberOfLettersRemaining(): number;
    abstract start(): void;
    abstract getWinner(): Player[];
    abstract isEndOfGame(): boolean;
    abstract stop(): void;
}
