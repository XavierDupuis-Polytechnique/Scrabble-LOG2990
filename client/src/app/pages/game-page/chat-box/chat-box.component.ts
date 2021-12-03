import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { NOT_ONLY_SPACE_RGX } from '@app/game-logic/constants';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/game-logic/interfaces/ui-input';
import { Message } from '@app/game-logic/messages/message.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BoldPipe } from '@app/pipes/bold-pipe/bold.pipe';
import { NewlinePipe } from '@app/pipes/newline-pipe/newline.pipe';
import { Observable } from 'rxjs';

const MAX_MESSAGE_LENGTH = 512;

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements AfterViewInit {
    @ViewChild('chat', { read: ElementRef }) chat: ElementRef;
    @Output() clickChatbox = new EventEmitter();
    readonly self = InputComponent.Chatbox;

    messageContent: string;

    readonly maxMessageLength = MAX_MESSAGE_LENGTH;
    private boldPipe = new BoldPipe();
    private newlinePipe = new NewlinePipe();

    constructor(private messageService: MessagesService, private cdRef: ChangeDetectorRef, private gameInfo: GameInfoService) {}

    ngAfterViewInit(): void {
        this.cdRef.detectChanges();
        this.messages$.subscribe(() => {
            this.cdRef.detectChanges();
            this.scrollDownChat();
        });
    }

    click() {
        const input: UIInput = { from: this.self, type: InputType.LeftClick };
        this.clickChatbox.emit(input);
    }

    sendMessage() {
        const content = this.messageContent;
        if (!this.isMessageValid(content)) {
            return;
        }
        const playerName = this.gameInfo.user.name;
        this.messageService.receiveMessagePlayer(playerName, content);

        this.resetMessageContent();
        this.cdRef.detectChanges();
        this.scrollDownChat();
    }

    generateMessageContentHTML(content: string) {
        let transformedContent = this.boldPipe.transform(content);
        transformedContent = this.newlinePipe.transform(transformedContent);
        return transformedContent;
    }

    isError(length: number) {
        if (length > this.maxMessageLength) {
            return true;
        }
        return false;
    }

    private resetMessageContent() {
        this.messageContent = '';
    }

    get messages$(): Observable<Message[]> {
        return this.messageService.messages$;
    }

    private isMessageValid(messageContent: string): boolean {
        if (!messageContent) {
            return false;
        }
        const content = messageContent;
        return content.length !== 0 && content.length <= MAX_MESSAGE_LENGTH && NOT_ONLY_SPACE_RGX.test(content);
    }

    private scrollDownChat() {
        const chatNativeElement = this.chat.nativeElement;
        chatNativeElement.scrollTop = chatNativeElement.scrollHeight;
    }
}
