import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { BoldPipe } from '@app/components/bold-pipe/bold.pipe';
import { NewlinePipe } from '@app/components/newline-pipe/newline.pipe';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Message } from '@app/GameLogic/messages/message.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Observable } from 'rxjs';

const NOT_ONLY_SPACE_RGX = new RegExp('.*[^ ].*');
const MAX_MESSAGE_LENGTH = 512;

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements AfterViewInit {
    @ViewChild('chat', { read: ElementRef }) chat: ElementRef;

    messageContent: string;

    readonly maxMessageLength = MAX_MESSAGE_LENGTH;
    private boldPipe = new BoldPipe();
    private newlinePipe = new NewlinePipe();

    constructor(private messageService: MessagesService, private cdRef: ChangeDetectorRef, private gameInfo: GameInfoService) {}

    ngAfterViewInit(): void {
        this.messages$.subscribe(() => {
            this.cdRef.detectChanges();
            this.scrollDownChat();
        });
    }

    sendMessage() {
        if (!this.messageValid) {
            return;
        }

        const content = this.messageContent;
        const playerName = this.gameInfo.user.name;
        this.messageService.receiveMessagePlayer(playerName, content);

        // this.messageForm.reset();
        this.resetMessageContent();
        this.cdRef.detectChanges();
        this.scrollDownChat();
    }

    resetMessageContent() {
        this.messageContent = '';
    }

    get messages$(): Observable<Message[]> {
        return this.messageService.messages$;
    }

    get messageValid(): boolean {
        if (this.messageContent === undefined) {
            return false;
        }
        const content = this.messageContent;
        return content.length !== 0 && content.length <= MAX_MESSAGE_LENGTH && NOT_ONLY_SPACE_RGX.test(content);
    }

    isError(length: number) {
        if (length > this.maxMessageLength) {
            return true;
        }
        return false;
    }

    scrollDownChat() {
        const chatNativeElement = this.chat.nativeElement;
        chatNativeElement.scrollTop = chatNativeElement.scrollHeight;
    }

    generateMessageHTML(message: Message) {
        let transformedContent = message.content;
        transformedContent = this.boldPipe.transform(transformedContent);
        transformedContent = this.newlinePipe.transform(transformedContent);

        return message.from + ': ' + transformedContent;
    }
}
