import { NEW_GAME_TIMEOUT } from '@app/constants';
import { GameCreator } from '@app/game/game-creator/game-creator';
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { OnlineAction } from '@app/game/online-action.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { GameCompiler } from '@app/services/game-compiler.service';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

interface PlayerRef {
    gameToken: string;
    player: Player;
}

@Service()
export class GameManagerService {
    activeGames = new Map<string, ServerGame>();
    activePlayers = new Map<string, PlayerRef>();
    linkedPlayerNames = new Map<string, string[]>();
    private gameCreator: GameCreator;

    private newGameStateSubject = new Subject<GameStateToken>();
    get newGameStates$(): Observable<GameStateToken> {
        return this.newGameStateSubject;
    }

    get timerControls$(): Observable<TimerGameControl> {
        return this.timerController.timerControls$;
    }

    constructor(
        private pointCalculator: PointCalculatorService,
        private messagesService: SystemMessagesService,
        private actionCompiler: ActionCompilerService,
        private gameCompiler: GameCompiler,
        private timerController: TimerController,
    ) {
        this.gameCreator = new GameCreator(
            this.pointCalculator,
            this.gameCompiler,
            this.messagesService,
            this.newGameStateSubject,
            this.timerController,
        );
    }

    createGame(gameToken: string, onlineGameSettings: OnlineGameSettings) {
        const newServerGame = this.gameCreator.createServerGame(onlineGameSettings, gameToken);
        this.activeGames.set(gameToken, newServerGame);
        this.linkedPlayerNames.set(gameToken, []);
        console.log('active games', this.activeGames);
        this.startSelfDestructTimer(gameToken);
    }

    startSelfDestructTimer(gameToken: string) {
        setTimeout(() => {
            const serverGame = this.activeGames.get(gameToken);
            if (this.linkedPlayerNames.get(gameToken)?.length !== 2) {
                if (serverGame) {
                    this.endGame(gameToken, serverGame);
                }
                this.activeGames.delete(gameToken);
                this.linkedPlayerNames.delete(gameToken);
            }
        }, NEW_GAME_TIMEOUT);
    }

    addPlayerToGame(playerId: string, userAuth: UserAuth) {
        const gameToken = userAuth.gameToken;
        console.log('User Auth-GameToken:', userAuth.gameToken);
        const game = this.activeGames.get(gameToken);
        if (!game) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }

        const playerName = userAuth.playerName;
        const user = game.players.find((player: Player) => player.name === playerName);
        if (!user) {
            throw Error(`Player ${playerName} not created in ${gameToken}`);
        }

        const linkedNames = this.linkedPlayerNames.get(gameToken);
        if (linkedNames === undefined) {
            throw Error(`Can't add player, GameToken ${gameToken} is not in active game`);
        }

        if (linkedNames.includes(playerName)) {
            throw Error(`Can't add player, someone else is already linked to ${gameToken} with ${playerName}`);
        }

        const playerRef = { gameToken, player: user };
        this.activePlayers.set(playerId, playerRef);
        linkedNames.push(playerName);
        console.log('active players', this.activePlayers);
        if (linkedNames.length === 2) {
            game.start();
        }
    }

    receivePlayerAction(playerId: string, action: OnlineAction) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            throw Error(`Player ${playerId} is not active anymore`);
        }
        const player = playerRef.player;
        try {
            const compiledAction = this.actionCompiler.translate(action, player);
            player.play(compiledAction);
            console.log(`${player.name} played ${action.type}.`);
        } catch (e) {
            console.log(`Server couldnt translate ${action.type} for ${player.name}`);
        }
    }

    removePlayerFromGame(playerId: string) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            return;
        }
        const gameToken = playerRef.gameToken;
        // TODO set winner to the player still online
        this.activePlayers.delete(playerId);
        const game = this.activeGames.get(gameToken);
        if (!game) {
            return;
        }
        this.endGame(gameToken, game);
        this.activeGames.delete(gameToken);
        console.log(`Player ${playerId} left the game`);
        console.log('Current active players', this.activePlayers);
        console.log('Current active games', this.activeGames);
    }

    private endGame(gameToken: string, game: ServerGame) {
        game.stop();
        const gameState = this.gameCompiler.compile(game);
        const gameStateToken: GameStateToken = { gameToken, gameState };
        this.newGameStateSubject.next(gameStateToken);
    }
}
