import { GameMasterService } from '@app/game-manager/game-master.service';
import { GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import * as http from 'http';
import { Server } from 'socket.io';

export class GameManager {
    private ioServer: Server;
    private gameMaster: GameMasterService = new GameMasterService();

    constructor(server: http.Server) {
        this.ioServer = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    gameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            socket.emit('showPendingGames', this.gameMaster.pendingGames); // Pour afficher les PendingGames

            socket.on('createGame', (gameSetting: GameSettingsMultiUI) => {
                console.log(gameSetting);
                this.gameMaster.createPendingGame(gameSetting);
            });

            socket.on('joinGame', (id: number, name: string) => {
                console.log(name);
                this.gameMaster.joinPendingGame(id, name);
            });
        });
        // this.ioServer.on('connection', (socket) => {
        //     socket.on('validate', (word: string) => {
        //         console.log('Joueur valide le mot: ', word);
        //         const isValid = this.dictionary.isWordInDict(word);
        //         socket.emit('wordValidated', isValid);
        //     });
        // });
    }
}
