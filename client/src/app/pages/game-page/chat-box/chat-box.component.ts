import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Message } from '@app/GameLogic/messages/message.interface';
// import { CommandParserService } from './command-parser/command-parser.service';
//import { MatInput } from '@angular/material/input';
const NOT_ONLY_SPACE_RGX = '.*[^ ].*';
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})

// Mettre un form pour desctiver le
// boutton s'il n y a rien d'entree
export class ChatBoxComponent {
    // Avoir une autre fonction linker/binder aver le placement etc...
    @ViewChild('chat') chat: ElementRef;

    messages: Message[] = [{ content: "test1", from: "player1" }];
    messageForm: FormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(NOT_ONLY_SPACE_RGX),
    ]);
    userInput: string;

    constructor(private cdRef: ChangeDetectorRef) {}

    sendChat() {
        if (!this.messageValid) {
            return;
        }

        const content = this.userInput;
        const newMessage = { content, from: "player1"};
        this.messages.push(newMessage);

        this.messageForm.reset();
        this.cdRef.detectChanges();
        this.scrollDownChat();
    }

    get messageValid(): boolean {
        return this.messageForm.valid;
    }

    scrollDownChat() {
        const chatNativeElement = this.chat.nativeElement
        chatNativeElement.scrollTop = chatNativeElement.scrollHeight;
    }
}
