import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommandParserService } from './command-parser/command-parser.service';

commandParser: CommandParserService;
// let noInput:boolean = false;
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})
/*
enum messageForwarder {
    SystemMessage,
    PlayerMessage,
    OpponentMesage
}

*/
// Mettre un form pour desctiver le
// boutton s'il n y a rien d'entree
export class ChatBoxComponent {
    // Avoir une autre fonction linker/binder aver le placement etc...
    @ViewChild('userEntry') userEntry: ElementRef;
    @ViewChild('sharedChat') sharedChat: HTMLTextAreaElement;
    @ViewChild('Chat') chat: ElementRef;

    constructor(private commandParserService: CommandParserService) {

    }

    sendChat() {
        const userEntry: string = this.userEntry.nativeElement.value;
        if (userEntry == '') {
          //  noInput = true;
            return;
        }
        console.log(userEntry);
        // Verifie s'i s'agit d'une commande
        let verifier = this.commandParserService.isCommand(userEntry, document.createElement('p'));
        let verifiedMessage = verifier[0];
        let command = verifier[1];

        // var messageCount = this.chat.nativeElement.;

        if (!command) {
            verifiedMessage.innerHTML = userEntry + '\n';// Peut etre l'enlever
            verifiedMessage.id = "message" /*+ messageCount*/;
            //count how many childs before adding to have the ID

        }
        // A ameliorer
        this.chat.nativeElement.appendChild(verifiedMessage);
        verifiedMessage.scrollIntoView(true);
        this.userEntry.nativeElement.value = '';
        console.log(verifiedMessage.className)
    }
}
