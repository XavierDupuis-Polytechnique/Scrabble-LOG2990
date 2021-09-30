import { Injectable } from '@angular/core';
import { GameInfoService } from '@app/GameLogic//game/game-info/game-info.service';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { BehaviorSubject } from 'rxjs';
import { Message, MessageType } from './message.interface';
@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    static readonly sysName = 'System';
    static readonly sysErrorName = 'SystemError';
    messagesLog: Message[] = [];

    messages$: BehaviorSubject<Message[]> = new BehaviorSubject([] as Message[]);
    constructor(private commandParser: CommandParserService, private gameInfo: GameInfoService) {}

    receiveMessage(forwarder: string, content: string) {
        const player1 = this.gameInfo.players[0].name;
        const player2 = this.gameInfo.players[1].name;
        let messageType: MessageType;

        if (forwarder === player1) {
            messageType = MessageType.Player1;
        } else if (forwarder === player2) {
            messageType = MessageType.Player2;
        } else {
            this.receiveSystemMessage('Message envoyé par un joueur inconnu');
            return;
        }

        const message = {
            content,
            from: forwarder,
            type: messageType,
        };

        try {
            this.commandParser.parse(content, forwarder);
            this.addMessageToLog(message);
        } catch (e) {
            if (e instanceof Error) {
                this.addMessageToLog(message);
                this.receiveError(e as Error);
            }
        }
    }

    receiveSystemMessage(content: string) {
        const systemMessage: Message = {
            content,
            from: MessagesService.sysName,
            type: MessageType.System,
        };
        this.addMessageToLog(systemMessage);
    }

    receiveErrorMessage(content: string) {
        const errorMessage = {
            content,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    receiveError(error: Error) {
        const errorMessage = {
            content: error.message,
            from: MessagesService.sysErrorName,
            type: MessageType.System,
        };
        this.addMessageToLog(errorMessage);
    }

    clearLog(): void {
        this.messagesLog = [];
        this.messages$.next(this.messagesLog);
    }

    private addMessageToLog(message: Message) {
        const messageCopy = { ...message };
        this.messagesLog.push(messageCopy);
        this.messages$.next(this.messagesLog);
    }
}
