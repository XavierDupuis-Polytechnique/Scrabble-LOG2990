import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/game-logic/interfaces/ui-input';
import { Message } from '@app/game-logic/messages/message.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BoldPipe } from '@app/pipes/bold-pipe/bold.pipe';
import { NewlinePipe } from '@app/pipes/newline-pipe/newline.pipe';
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
    @Output() clickChatbox = new EventEmitter();
    readonly self = InputComponent.Chatbox;

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

    click() {
        const input: UIInput = { from: this.self, type: InputType.LeftClick };
        this.clickChatbox.emit(input);
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
