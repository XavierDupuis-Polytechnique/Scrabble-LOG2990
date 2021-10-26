import { GameCreator } from '@app/game/game-creator/game-creator';
import { PassTurn } from '@app/game/game-logic/actions/pass-turn';
import { BoardService } from '@app/game/game-logic/board/board.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerService } from '@app/game/game-logic/timer/timer.service';
import { OnlineAction } from '@app/game/online-action.interface';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

interface PlayerRef {
    gameToken: string;
    player: Player;
}

@Service()
export class GameManagerService {
    activeGames = new Map<string, ServerGame>();
    activePlayers = new Map<string, PlayerRef>(); // playerId => PlayerRef
    private newGameStateSubject = new Subject<string>();
    private gameCreator: GameCreator;

    constructor(
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        // private messageService: MessagesService,
        private boardService: BoardService,
    ) {
        this.gameCreator = new GameCreator(this.timer, this.pointCalculator, this.boardService);
        this.activeGames.set('1', new ServerGame(false, 60000, this.timer, this.pointCalculator, this.boardService));
    }

    createGame(gameToken: string, onlineGameSettings: OnlineGameSettings) {
        const newServerGame = this.gameCreator.createServerGame(onlineGameSettings);
        this.activeGames.set(gameToken, newServerGame);
        console.log('active games', this.activeGames);
    }

    addPlayerToGame(playerId: string, gameToken: string) {
        const game = this.activeGames.get(gameToken);
        if (!game) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }
        // TODO get reference des players de la game
        const playerRef = { gameToken, player: new Player() };
        this.activePlayers.set(playerId, playerRef);
        console.log('active players', this.activePlayers);
        // TODO when theres 2 player connected
        // newServerGame.startGame();
    }

    receivePlayerAction(playerId: string, action: OnlineAction) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            throw Error(`Player ${playerId} is not active anymore`);
        }
        const player = playerRef.player;
        // TODO compile action
        // player.play(action);
        player.play(new PassTurn(player));
    }

    removePlayerFromGame(playerId: string) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            return;
        }
        const gameToken = playerRef.gameToken;
        // TODO set winner to the player still online
        this.activePlayers.delete(playerId);
        this.activeGames.delete(gameToken);
        console.log(`Player ${playerId} left the game`);
        console.log('Current active players', this.activePlayers);
        console.log('Current active games', this.activeGames);
    }

    get newGameStates$(): Observable<string> {
        return this.newGameStateSubject;
    }
}
