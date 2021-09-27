import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Observable } from 'rxjs';

const NOT_ONLY_SPACE_RGX = '.*[^ ].*';
const MAX_MESSAGE_LENGTH = 512;

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent {
    // Avoir une autre fonction linker/binder aver le placement etc...
    @ViewChild('chat') chat: ElementRef;

    messageForm: FormControl = new FormControl('', [
        Validators.required,
        Validators.maxLength(MAX_MESSAGE_LENGTH),
        Validators.pattern(NOT_ONLY_SPACE_RGX),
    ]);
    readonly maxMessageLength = MAX_MESSAGE_LENGTH;
    constructor(private messageService: MessagesService, private cdRef: ChangeDetectorRef) {}

    sendMessage() {
        if (!this.messageValid) {
            return;
        }

        const content = this.messageForm.value;
        const newMessage = { content, from: 'player1', type: MessageType.Player1 };
        this.messageService.receiveMessage(newMessage);

        this.messageForm.reset();
        this.cdRef.detectChanges();
        this.scrollDownChat();
    }

    get messages$(): Observable<Message[]> {
        return this.messageService.messages$;
    }

    get messageValid(): boolean {
        return this.messageForm.valid;
    }

    scrollDownChat() {
        const chatNativeElement = this.chat.nativeElement;
        chatNativeElement.scrollTop = chatNativeElement.scrollHeight;
    }
}
