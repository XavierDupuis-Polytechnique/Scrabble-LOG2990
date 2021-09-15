import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message } from '@app/GameLogic/messages/message.interface';
// import { CommandParserService } from './command-parser/command-parser.service';
//import { MatInput } from '@angular/material/input';

// let noInput:boolean = false;
@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss'],
})

// Mettre un form pour desctiver le
// boutton s'il n y a rien d'entree
export class ChatBoxComponent implements OnInit {
    // Avoir une autre fonction linker/binder aver le placement etc...
    // @ViewChild('userEntry') userEntry: MatInput;
    // @ViewChild('userEntry') userEntry: MatInput;
    // @ViewChild('chat') chat: HTMLTextAreaElement;
    constructor(private cdRef: ChangeDetectorRef) {}
    messages: Message[] = [{ id:'0', content: "test1", from: "player1" }];
    userInput: string;
    // constructor(private commandParserService: CommandParserService) {}

    ngOnInit() {
        // console.log('userEntry', this.userEntry);
        // console.log('chat', chat);
        // console.log('userEntry', this.userEntry);

    }

    sendChat() {
        // console.log("userentry", this.userEntry);

        const content = this.userInput;
        const id = this.messages.length.toString();
        const newMessage = {id, content, from: "player1"};
        console.log(content);
        this.messages.push(newMessage);
        const messageId = newMessage.id;
        this.cdRef.detectChanges();
        
        if (messageId !== null) {
            console.log('query', 'm'+messageId);
            const elem = document.querySelector('#m'+messageId);
            console.log(elem);
            elem?.scrollIntoView(true);
        }

        // console.log(this.userEntry.nativeElement.value);
        // const userEntry: string = this.userEntry.nativeElement.value;

        // if (userEntry == '') return;

        // // Verifie s'i s'agit d'une commande
        // let verifier = this.commandParserService.verifyCommand(userEntry, document.createElement('div'));
        // let verifiedMessage = verifier[0];
        // // let isCommand = verifier[1];
        // if (verifiedMessage.nodeValue?.split(' ')[1] == 'invalide') {
        //     return;
        // }

        // verifiedMessage.innerHTML += userEntry + '\n';// Peut-etre l'enlever
        // verifiedMessage.id = "message" /*+ messageCount*/;
        // //count how many childs before adding to have the ID

        // // A ameliorer
        // this.chat.nativeElement.appendChild(verifiedMessage);
        // verifiedMessage.scrollIntoView(true);
        // this.userEntry.nativeElement.value = '';
        // console.log(verifiedMessage.className)
    }
}
