import { GameMasterService } from '@app/game-manager/game-master.service';
import { GameSettingsMultiUI } from '@app/game-manager/game-settings-multi.interface';
import * as http from 'http';
import { Server } from 'socket.io';

export class GameManager {
    private ioServer: Server;

    constructor(server: http.Server, private gameMaster: GameMasterService) {
        this.ioServer = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    gameHandler(): void {
        this.ioServer.on('connection', (socket) => {
            // console.log(this.gameMaster.getPendingGames());
            socket.emit('showPendingGames', this.gameMaster.getPendingGames());

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
