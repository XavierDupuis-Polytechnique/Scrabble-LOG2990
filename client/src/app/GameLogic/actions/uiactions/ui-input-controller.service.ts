import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { UIExchange } from '@app/GameLogic/actions/uiactions/ui-exchange';
import { UIMove } from '@app/GameLogic/actions/uiactions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/uiactions/ui-place';
import { ENTER, ESCAPE } from '@app/GameLogic/constants';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/GameLogic/interface/ui-input';

@Injectable({
    providedIn: 'root',
})
export class UIInputControllerService {
    static defaultComponent = InputComponent.Horse;
    activeComponent = UIInputControllerService.defaultComponent;
    activeAction: UIAction | null = null;
    activeLetters: Letter[] = [];

    constructor(private avs: ActionValidatorService, private info: GameInfoService) {}

    receive(input: UIInput) {
        // TODO : REMOVE NEXT LINE
        console.log('received', input);
        this.dispatch(input);
    }

    processInputComponent(input: UIInput) {
        if (input.from === undefined) {
            this.activeComponent = UIInputControllerService.defaultComponent;
            return;
        }
        this.activeComponent = input.from;
    }

    updateActiveAction(inputType: InputType): boolean {
        switch (this.activeComponent) {
            case InputComponent.Board:
                if (!(this.activeAction instanceof UIPlace)) {
                    this.activeAction = new UIPlace();
                    return true;
                }
                break;
            case InputComponent.Horse:
                if (inputType === InputType.RightClick) {
                    if (!(this.activeAction instanceof UIExchange)) {
                        this.activeAction = new UIExchange();
                        return true;
                    }
                } else {
                    // LEFTCLICK or KEYPRESS
                    if (!(this.activeAction instanceof UIMove)) {
                        this.activeAction = new UIMove();
                        return true;
                    }
                }
                break;
            case InputComponent.Outside:
                if (this.activeAction) {
                    this.discardAction();
                    return true;
                }
        }
        return false;
    }

    processInputType(input: UIInput) {
        switch (input.type) {
            case InputType.LeftClick:
                this.processLeftCLick();
                break;
            case InputType.RightClick:
                this.processRightCLick();
                break;
            case InputType.KeyPress:
                this.processKeyPress(input.args);
                break;
            case InputType.MouseRoll:
                this.processMouseRoll(input.args);
                break;
            default:
                throw new Error('Unresolved input of type ' + input.type);
        }
    }

    cancel() {
        this.discardAction();
    }

    confirm() {
        if (this.activeAction === null) {
            throw new Error('Action couldnt be created : no UIAction is active');
        }
        const newAction: Action = this.activeAction.create(this.info.user);
        this.avs.sendAction(newAction);
    }

    private dispatch(input: UIInput) {
        this.processInputComponent(input);
        // TODO : REMOVE NEXT LINE
        console.log('ACTIVE COMPONENT : ', this.activeComponent);
        this.updateActiveAction(input.type);
        this.processInputType(input);
    }

    private discardAction() {
        this.activeAction = null;
        this.activeComponent = InputComponent.Outside;
    }

    private processMouseRoll(args: unknown) {
        throw new Error('Method not implemented.');
    }

    private processKeyPress(args: unknown) {
        const keyPressed = args as string;
        switch (keyPressed) {
            case ESCAPE:
                this.discardAction();
                break;
            case ENTER:
                this.confirm();
                break;
            default:
                if (this.activeAction !== null) {
                    this.activeAction.receiveKey(keyPressed);
                    return;
                } else {
                    throw new Error('Action is null');
                }
        }
    }

    private processLeftCLick() {
        throw new Error('Method not implemented.');
    }

    private processRightCLick() {
        throw new Error('Method not implemented.');
    }
}
