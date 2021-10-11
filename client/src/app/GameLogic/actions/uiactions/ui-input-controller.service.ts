import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { InputComponent, UIInput } from '@app/GameLogic/interface/ui-input';

@Injectable({
    providedIn: 'root',
})
export class UIInputControllerService {
    activeComponent = InputComponent.Horse;
    activeAction: UIAction | null = null;
    activeLetters: Letter[] = [];

    constructor(private avs: ActionValidatorService) {}

    receive(input: UIInput) {
        this.dispatch(input);
        // TODO : REMOVE NEXT 2 LINES
        console.log('received', input);
        console.log('ACTIVE COMPONENT : ', this.activeComponent)
    }

    dispatch(input: UIInput) {
        switch (input.from) {
            case InputComponent.Board:
                // this.activeAction = new UIPlace();
                break;
            case InputComponent.Horse:
                //
                break;
            case InputComponent.Outside:
                //
                break;
            default:
                throw new Error('Unresolved input from component ' + input.from);
        }
        if (input.from !== undefined) {
            this.activeComponent = input.from;
        }
    }

    cancel() {
        this.activeAction = null;
    }

    confirm() {
        if (this.activeAction === null) {
            throw new Error("Action couldnt be created : no UIAction is active")
        }
        const newAction: Action = this.activeAction.create();
        this.avs.sendAction(newAction)
    }
}
