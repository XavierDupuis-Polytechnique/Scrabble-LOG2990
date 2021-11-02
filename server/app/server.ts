import { Application } from '@app/app';
import { NewOnlineGameService } from '@app/game-manager/new-online-game.service';
import { MessagesSocketHandler } from '@app/messages-service/message-socket-handler/messages-socket-handler.service';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { NewOnlineGameSocketHandler } from '@app/services/new-online-game-manager';
import * as http from 'http';
import { AddressInfo } from 'net';
import { Service } from 'typedi';

@Service()
export class Server {
    private static readonly appPort: string | number | boolean = Server.normalizePort(process.env.PORT || '3000');
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    private static readonly baseDix: number = 10;
    private server: http.Server;
    private onlineGameManager: NewOnlineGameSocketHandler;
    private messageHandler: MessagesSocketHandler;
    constructor(
        private readonly application: Application,
        private onlineGameService: NewOnlineGameService,
        private systemMessagesService: SystemMessagesService,
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

    init(): void {
        this.application.app.set('port', Server.appPort);

        this.server = http.createServer(this.application.app);
        this.onlineGameManager = new NewOnlineGameSocketHandler(this.server, this.onlineGameService);
        this.onlineGameManager.newGameHandler();

        this.messageHandler = new MessagesSocketHandler(this.server, this.systemMessagesService);
        this.messageHandler.handleSockets();
        this.server.listen(Server.appPort);
        this.server.on('error', (error: NodeJS.ErrnoException) => this.onError(error));
        this.server.on('listening', () => this.onListening());
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
