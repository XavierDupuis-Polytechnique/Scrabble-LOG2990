import { Action } from '@app/game/game-logic/actions/action';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { Board } from '@app/game/game-logic/board/board';
import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { MAX_CONSECUTIVE_PASS } from '@app/game/game-logic/constants';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { Timer } from '@app/game/game-logic/timer/timer.service';
import { GameCompiler } from '@app/services/game-compiler.service';
import { first, mapTo, merge, Subject } from 'rxjs';

export class ServerGame {
    static readonly maxConsecutivePass = MAX_CONSECUTIVE_PASS;
    letterBag: LetterBag = new LetterBag();
    players: Player[] = [];
    activePlayerIndex: number;
    consecutivePass: number = 0;
    timer = new Timer();
    board: Board;

    constructor(
        public randomBonus: boolean,
        public timePerTurn: number,
        public gameToken: string,
        private pointCalculator: PointCalculatorService, // private messagesService: MessagesService,
        private gameCompiler: GameCompiler,
        private newGameStateSubject: Subject<GameStateToken>,
    ) {
        this.board = new Board(randomBonus);
    }

    startGame(): void {
        console.log('Starting a game');
        if (this.players.length < 2) {
            throw Error('Game started with no players');
        }
        this.drawGameLetters();
        this.pickFirstPlayer();
        this.startTurn();
    }

    nextPlayer() {
        this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length;
    }

    isEndOfGame() {
        console.log('Consecutive pass ', this.consecutivePass);
        if (this.letterBag.isEmpty) {
            for (const player of this.players) {
                if (player.isLetterRackEmpty) {
                    return true;
                }
            }
        }
        if (this.consecutivePass >= ServerGame.maxConsecutivePass) {
            return true;
        }
        return false;
    }

    getActivePlayer() {
        return this.players[this.activePlayerIndex];
    }

    onEndOfGame() {
        console.log('GAME ENDED');
        this.pointCalculator.endOfGamePointDeduction(this);
        // TODO : replace function behavior and uncomment
        // this.displayLettersLeft();
    }

    doAction(action: Action) {
        if (action instanceof PassTurn) {
            this.consecutivePass += 1;
        } else {
            this.consecutivePass = 0;
        }
    }

    getWinner(): Player[] {
        let highestScore = Number.MIN_SAFE_INTEGER;
        let winners: Player[] = [];
        for (const player of this.players) {
            if (player.points === highestScore) {
                winners.push(player);
            }
            if (player.points > highestScore) {
                highestScore = player.points;
                winners = [player];
            }
        }
        return winners;
    }

    private pickFirstPlayer() {
        const max = this.players.length;
        const firstPlayer = Math.floor(Math.random() * max);
        this.activePlayerIndex = firstPlayer;
    }

    private drawGameLetters() {
        for (const player of this.players) {
            player.letterRack = this.letterBag.drawEmptyRackLetters();
        }
    }

    private startTurn() {
        const activePlayer = this.players[this.activePlayerIndex];
        console.log(`Start ${activePlayer.name}'s turn`);
        console.log(activePlayer);
        // activePlayer.setActive();
        const timerEnd$ = this.timer.start(this.timePerTurn).pipe(mapTo(new PassTurn(activePlayer)));
        const turnEnds$ = merge(activePlayer.action$, timerEnd$);
        turnEnds$.pipe(first()).subscribe((action) => this.endOfTurn(action));
    }

    private endOfTurn(action: Action) {
        this.timer.stop();

        action.end$.subscribe(() => {
            if (this.isEndOfGame()) {
                this.onEndOfGame();
                return;
            }
            this.nextPlayer();
            this.startTurn();
        });

        action.execute(this);
        this.emitGameState();
    }

    private emitGameState() {
        const gameState = this.gameCompiler.compile(this);
        const gameStateToken: GameStateToken = { gameState, gameToken: this.gameToken };
        this.newGameStateSubject.next(gameStateToken);
    }

    // TODO : replace core function with new Message Service behavior
    // private displayLettersLeft() {
    //     let message = 'Fin de partie - lettres restantes';
    //     this.messagesService.receiveSystemMessage(message);
    //     for (const player of this.players) {
    //         message = `${player.name}: ${player.printLetterRack()}`;
    //         this.messagesService.receiveSystemMessage(message);
    //     }
    // }
}
