import { Component, ElementRef, ViewChild } from '@angular/core';
enum Command {
    NotACommand,
    Help = '!aide',
    Place = '!placer',
    Exchanger = '!échanger',
    Pass = '!passer',
}

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
class MessageForwarded {
    public type: HTMLParagraphElement; // paragraph
    private isCommand: boolean = false; // est une commande
    private command: Command = Command.NotACommand;
    private messageForwarder = messageForwarder.SystemMessage;
}
*/

// Mettre un form pour desctiver le
// boutton s'il n y a rien d'entree
export class ChatBoxComponent {
    // Avoir une autre fonction linker/binder aver le placement etc...
    @ViewChild('userEntry') userEntry: ElementRef;
    @ViewChild('sharedChat') sharedChat: HTMLTextAreaElement;
    @ViewChild('Chat') chat: ElementRef;

    sendChat() {
        const userEntry: string = this.userEntry.nativeElement.value;
        if (userEntry == '') return;

        console.log(userEntry);
        // Verifie s'i s'agit d'une commande
        let verifier = this.isCommand(userEntry, document.createElement('p'));
        let verifiedMessage = verifier[0];
        let command = verifier[1];

        // var messageCount = this.chat.nativeElement.;

        if (!command) {
            verifiedMessage.innerHTML = userEntry;
            verifiedMessage.id = "message" /*+ messageCount*/;
            //count how many childs before adding to have the ID

        }
        // A ameliorer
        this.chat.nativeElement.appendChild(verifiedMessage);
        verifiedMessage.scrollIntoView(true);
        this.userEntry.nativeElement.value = '';
        console.log(verifiedMessage.className)
    }

    isCommand(toVerify: string, Message: HTMLParagraphElement): [HTMLParagraphElement, boolean] {
        // Couper l'entry par espace pour verifier s'il s'agit d'une commande
        const commandCondition = toVerify.split(' ')[0];
        // console.log('AAHHHHHHH')
        if (commandCondition[0] == '!') {

            switch (commandCondition) {
                case Command.Place: {
                    Message.classList.add('systemMessage');
                    Message.innerHTML = 'Commande';

                    return [Message, true];
                }
                case Command.Pass: {
                    Message.classList.add('systemMessage');
                    return [Message, true];
                }
                default: {
                    return [Message, false];
                }
            }
        }
        return [Message, false];
    }
}
