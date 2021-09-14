import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommandParserService } from './command-parser/command-parser.service';
// import { MatInput } from '@angular/material/input';

// let noInput:boolean = false;
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})

// Mettre un form pour desctiver le
// boutton s'il n y a rien d'entree
export class ChatBoxComponent {
    // Avoir une autre fonction linker/binder aver le placement etc...
   // @ViewChild('userEntry') userEntry: MatInput;
    @ViewChild('userEntry') userEntry: ElementRef;

    @ViewChild('sharedChat') sharedChat: HTMLTextAreaElement;
    @ViewChild('Chat') chat: ElementRef;

    constructor(private commandParserService: CommandParserService) {

    }

    sendChat() {
        console.log(this.userEntry.nativeElement.value);
        const userEntry: string = this.userEntry.nativeElement.value;

        if (userEntry == '') return;

        // Verifie s'i s'agit d'une commande
        let verifier = this.commandParserService.isCommand(userEntry, document.createElement('div'));
        let verifiedMessage = verifier[0];
        //let command = verifier[1];

        verifiedMessage.innerHTML += userEntry + '\n';// Peut-etre l'enlever
        verifiedMessage.id = "message" /*+ messageCount*/;
        //count how many childs before adding to have the ID


        // A ameliorer
        this.chat.nativeElement.appendChild(verifiedMessage);
        verifiedMessage.scrollIntoView(true);
        this.userEntry.nativeElement.value = '';
        console.log(verifiedMessage.className)
    }
}
