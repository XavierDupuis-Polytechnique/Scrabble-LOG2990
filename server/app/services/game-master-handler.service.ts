import { GameMasterService } from '@app/game-manager/game-master.service';
import { GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import * as http from 'http';
import { Server } from 'socket.io';

const showPendingGames = 'showPendingGames';
const createGame = 'createGame';
const joinGame = 'joinGame';
export class GameManager {
    private ioServer: Server;

    constructor(server: http.Server, private gameMaster: GameMasterService) {
        this.ioServer = new Server(server, {
            path: '/newGame',
            cors: { origin: '*', methods: ['GET', 'POST'] },
        });
    }

    newGameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            socket.emit(showPendingGames, this.gameMaster.getPendingGames());

            socket.on(createGame, (gameSetting: GameSettingsMultiUI) => {
                console.log(gameSetting); // TODO: remove
                this.gameMaster.createPendingGame(gameSetting);
                this.emitPendingGamesToAll();
            });

            socket.on(joinGame, (id: number, name: string) => {
                this.gameMaster.joinPendingGame(id, name);
                this.emitPendingGamesToAll();
            });
        });
    }

    emitPendingGamesToAll() {
        this.ioServer.sockets.emit(showPendingGames, this.gameMaster.getPendingGames());
    }
}
