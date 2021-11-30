import { Application } from '@app/app';
import { DatabaseService } from '@app/database/database.service';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { GameManagerService } from '@app/game/game-manager/game-manager.services';
import { GameSocketsHandler } from '@app/game/game-socket-handler/game-socket-handler.service';
import { MessagesSocketHandler } from '@app/messages-service/message-socket-handler/messages-socket-handler.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { NewGameManagerService } from '@app/new-game/new-game-manager/new-game-manager.service';
import { NewGameSocketHandler } from '@app/new-game/new-game-socket-handler/new-game-socket-handler';
import * as http from 'http';
import { AddressInfo } from 'net';
import { Service } from 'typedi';
@Service()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly baseDix: number = 10;
    private server: http.Server;
    private onlineGameManager: NewGameSocketHandler;
    private gameSocketsHandler: GameSocketsHandler;
    private messageHandler: MessagesSocketHandler;
    constructor(
        private readonly application: Application,
        private onlineGameService: NewGameManagerService,
        private gameManager: GameManagerService,
        private systemMessagesService: SystemMessagesService,
        private databaseService: DatabaseService,
        private dictionaryService: DictionaryService,
    ) {}
    private static normalizePort(val: number | string): number | string | boolean {
        const port: number = typeof val === 'string' ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    async init(): Promise<void> {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);

        this.onlineGameManager = new NewGameSocketHandler(this.server, this.onlineGameService, this.dictionaryService);
        this.onlineGameManager.newGameHandler();

        this.gameSocketsHandler = new GameSocketsHandler(this.server, this.gameManager);
        this.gameSocketsHandler.handleSockets();

        this.messageHandler = new MessagesSocketHandler(this.server, this.systemMessagesService);
        this.messageHandler.handleSockets();
        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
        try {
            await this.databaseService.start();
        } catch {
            process.exit(1);
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind: string = typeof Server.appPort === 'string' ? 'Pipe ' + Server.appPort : 'Port ' + Server.appPort;
        switch (error.code) {
            case 'EACCES':
                // eslint-disable-next-line no-console
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                // eslint-disable-next-line no-console
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Se produit lorsque le serveur se met à écouter sur le port.
     */
    private onListening(): void {
        const addr = this.server.address() as AddressInfo;
        const bind: string = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
        // eslint-disable-next-line no-console
        console.log(`Listening on ${bind}`);
    }
}
