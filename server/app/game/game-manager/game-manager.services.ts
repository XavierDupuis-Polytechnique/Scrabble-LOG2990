import { NEW_GAME_TIMEOUT } from '@app/constants';
import { GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
import { GameCreator } from '@app/game/game-creator/game-creator';
import { Action } from '@app/game/game-logic/actions/action';
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { TimerGameControl } from '@app/game/game-logic/timer/timer-game-control.interface';
import { BindedSocket } from '@app/game/game-manager/binded-client.interface';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { OnlineAction } from '@app/game/online-action.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { OnlineGameSettings } from '@app/online-game-init/game-settings-multi.interface';
import { GameCompiler } from '@app/services/game-compiler.service';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

export interface PlayerRef {
    gameToken: string;
    player: Player;
}

@Service()
export class GameManagerService {
    activeGames = new Map<string, ServerGame>();
    activePlayers = new Map<string, PlayerRef>(); // gameToken => PlayerRef[]
    linkedClients = new Map<string, BindedSocket[]>(); // gameToken => BindedSocket[]
    private gameCreator: GameCreator;
    private newGameStateSubject = new Subject<GameStateToken>();
    get newGameState$(): Observable<GameStateToken> {
        return this.newGameStateSubject;
    }

    get timerControl$(): Observable<TimerGameControl> {
        return this.timerController.timerControl$;
    }

    constructor(
        private pointCalculator: PointCalculatorService,
        private messagesService: SystemMessagesService,
        private actionCompiler: ActionCompilerService,
        private gameCompiler: GameCompiler,
        private timerController: TimerController,
        private gameActionNotifier: GameActionNotifierService,
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
        this.linkedClients.set(gameToken, []);
        this.startInactiveGameDestructionTimer(gameToken);
    }

    addPlayerToGame(playerId: string, userAuth: UserAuth) {
        const gameToken = userAuth.gameToken;
        const game = this.activeGames.get(gameToken);
        if (!game) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }

        const playerName = userAuth.playerName;
        const user = game.players.find((player: Player) => player.name === playerName);
        if (!user) {
            throw Error(`Player ${playerName} not created in ${gameToken}`);
        }

        const linkedClientsInGame = this.linkedClients.get(gameToken);
        if (linkedClientsInGame === undefined) {
            throw Error(`Can't add player, GameToken ${gameToken} is not in active game`);
        }
        const clientFound = linkedClientsInGame.find((client: BindedSocket) => client.name === playerName);
        if (clientFound !== undefined) {
            throw Error(`Can't add player, someone else is already linked to ${gameToken} with ${playerName}`);
        }

        const playerRef = { gameToken, player: user };
        this.activePlayers.set(playerId, playerRef);
        const bindedSocket: BindedSocket = { socketID: playerId, name: playerName };
        linkedClientsInGame.push(bindedSocket);
        if (linkedClientsInGame.length === 2) {
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
            const gameToken = playerRef.gameToken;
            this.notifyAction(compiledAction, gameToken);
            player.play(compiledAction);
            // eslint-disable-next-line no-empty
        } catch (e) {
            return;
        }
    }

    removePlayerFromGame(playerId: string) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            throw Error(`Player ${playerId} is not active anymore`);
        }
        const gameToken = playerRef.gameToken;
        // TODO set winner to the player still online
        this.activePlayers.delete(playerId);
        const game = this.activeGames.get(gameToken);
        if (!game) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }
        this.endForfeitedGame(game, playerRef.player.name);
        this.activeGames.delete(gameToken);
    }

    private startInactiveGameDestructionTimer(gameToken: string) {
        setTimeout(() => {
            const currentLinkedClient = this.linkedClients.get(gameToken);
            if (currentLinkedClient === undefined) {
                this.deleteGame(gameToken);
                return;
            }

            if (currentLinkedClient.length !== 2) {
                this.deleteGame(gameToken);
                return;
            }
        }, NEW_GAME_TIMEOUT);
    }

    private notifyAction(action: Action, gameToken: string) {
        const clientsInGame = this.linkedClients.get(gameToken);
        if (!clientsInGame) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }
        this.gameActionNotifier.notify(action, clientsInGame, gameToken);
    }

    private endGame(game: ServerGame) {
        game.stop();
    }

    private endForfeitedGame(game: ServerGame, playerName: string) {
        game.forfeit(playerName);
        game.stop();
    }

    private deleteGame(gameToken: string) {
        const serverGame = this.activeGames.get(gameToken);
        if (serverGame) {
            this.endGame(serverGame);
        }
        this.activeGames.delete(gameToken);
        this.linkedClients.delete(gameToken);
    }
}
