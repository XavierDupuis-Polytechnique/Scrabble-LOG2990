import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { UIExchange } from '@app/GameLogic/actions/uiactions/ui-exchange';
import { UIMove } from '@app/GameLogic/actions/uiactions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/uiactions/ui-place';
import { ENTER, ESCAPE } from '@app/GameLogic/constants';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/GameLogic/interface/ui-input';

@Injectable({
    providedIn: 'root',
})
export class UIInputControllerService {
    static defaultComponent = InputComponent.Horse;
    activeComponent = UIInputControllerService.defaultComponent;
    activeAction: UIAction | null = null;

    get canBeExecuted() {
        return this.activeAction?.canBeCreated;
    }

    constructor(private avs: ActionValidatorService, private info: GameInfoService) {}

    receive(input: UIInput) {
        console.log('received', input); // TODO : REMOVE THIS LINE
        this.processInput(input);
    }

    processInput(input: UIInput) {
        this.processInputComponent(input);
        console.log('ACTIVE COMPONENT : ', this.activeComponent); // TODO : REMOVE THIS LINE
        this.updateActiveAction(input.type);
        console.log('ACTIVE ACTION : ', this.activeAction); // TODO : REMOVE THIS LINE
        this.processInputType(input);
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
                    this.activeAction = new UIPlace(/*this.info.user*/);
                    return true;
                }
                break;
            case InputComponent.Horse:
                if (inputType === InputType.RightClick) {
                    if (!(this.activeAction instanceof UIExchange)) {
                        this.activeAction = new UIExchange(this.info.user);
                        return true;
                    }
                } else {
                    // LEFTCLICK or KEYPRESS or MOUSEWHEEL
                    if (!(this.activeAction instanceof UIMove)) {
                        this.activeAction = new UIMove(this.info.user);
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
                this.processLeftCLick(input.args);
                break;
            case InputType.RightClick:
                this.processRightCLick(input.args);
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
        console.log('ACTIVE ACTION : ', this.activeAction, ' will be discarded'); // TODO : REMOVE THIS LINE
        this.discardAction();
    }

    confirm() {
        if (this.activeAction === null) {
            throw new Error('Action couldnt be created : no UIAction is active');
        }
        const newAction: Action = this.activeAction.create();
        this.avs.sendAction(newAction);
        this.discardAction();
    }

    private discardAction() {
        this.activeAction = null;
        this.activeComponent = InputComponent.Outside;
    }

    private processMouseRoll(args: unknown) {
        if (this.activeAction) {
            this.activeAction.receiveRoll(args);
        }
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
                if (this.activeAction) {
                    this.activeAction.receiveKey(keyPressed);
                    return;
                } else {
                    throw new Error('Action is null');
                }
        }
    }

    private processLeftCLick(args: unknown) {
        if (this.activeAction !== null) {
            this.activeAction.receiveLeftClick(args);
            return;
        }
    }

    private processRightCLick(args: unknown) {
        if (this.activeAction !== null) {
            this.activeAction.receiveRightClick(args);
            return;
        }
    }
}
