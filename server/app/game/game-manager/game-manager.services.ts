import { GameCreator } from '@app/game/game-creator/game-creator';
import { ActionCompilerService } from '@app/game/game-logic/actions/action-compiler.service';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { UserAuth } from '@app/game/game-socket-handler/user-auth.interface';
import { OnlineAction } from '@app/game/online-action.interface';
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
    numberOfPlayers = new Map<string, number>();
    private gameCreator: GameCreator;

    private newGameStateSubject = new Subject<GameStateToken>();
    get newGameStates$(): Observable<GameStateToken> {
        return this.newGameStateSubject;
    }

    constructor(
        private pointCalculator: PointCalculatorService,
        // private messageService: MessagesService,
        private actionCompiler: ActionCompilerService,
        private gameCompiler: GameCompiler,
    ) {
        this.gameCreator = new GameCreator(this.pointCalculator, this.gameCompiler, this.newGameStateSubject);
    }

    createGame(gameToken: string, onlineGameSettings: OnlineGameSettings) {
        const newServerGame = this.gameCreator.createServerGame(onlineGameSettings, gameToken);
        this.activeGames.set(gameToken, newServerGame);
        this.numberOfPlayers.set(gameToken, 0);
        console.log('active games', this.activeGames);
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
        const playerRef = { gameToken, player: user };
        this.activePlayers.set(playerId, playerRef);
        this.increaseNumberOfPlayers(gameToken);
        console.log('active players', this.activePlayers);
        if (this.numberOfPlayers.get(gameToken) === 2) {
            game.startGame();
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
        game?.onEndOfGame();
        this.activeGames.delete(gameToken);
        console.log(`Player ${playerId} left the game`);
        console.log('Current active players', this.activePlayers);
        console.log('Current active games', this.activeGames);
    }

    increaseNumberOfPlayers(gameToken: string) {
        let numberOfPlayers = this.numberOfPlayers.get(gameToken);
        if (numberOfPlayers === undefined) {
            throw Error(`Can't add player, GameToken ${gameToken} is not in active game`);
        }
        numberOfPlayers += 1;
        this.numberOfPlayers.set(gameToken, numberOfPlayers);
    }
}
