import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { UIAction } from '@app/GameLogic/actions/ui-actions/ui-action';
import { UIExchange } from '@app/GameLogic/actions/ui-actions/ui-exchange';
import { UIMove } from '@app/GameLogic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/ui-actions/ui-place';
import { ENTER, ESCAPE } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/GameLogic/interface/ui-input';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

@Injectable({
    providedIn: 'root',
})
export class UIInputControllerService {
    static defaultComponent = InputComponent.Horse;
    activeComponent = UIInputControllerService.defaultComponent;
    activeAction: UIAction | null = null;

    get canBeExecuted(): boolean {
        if (this.activeAction) {
            return this.activeAction.canBeCreated;
        }
        return false;
    }

    constructor(
        private avs: ActionValidatorService,
        private info: GameInfoService,
        private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private boardService: BoardService,
    ) {
        this.info.endTurn$?.subscribe(() => {
            if (this.activeAction instanceof UIPlace) {
                this.discardAction();
            }
        });
    }

    receive(input: UIInput) {
        this.processInput(input);
    }

    processInput(input: UIInput) {
        this.processInputComponent(input);
        this.updateActiveAction(input.type);
        this.processInputType(input);
    }

    processInputComponent(input: UIInput) {
        if (input.from === undefined) {
            if (this.activeComponent === InputComponent.Outside) {
                this.activeComponent = UIInputControllerService.defaultComponent;
            }
            return;
        }
        this.activeComponent = input.from;
    }

    updateActiveAction(inputType: InputType): boolean {
        switch (this.activeComponent) {
            case InputComponent.Board:
                if (!(this.activeAction instanceof UIPlace)) {
                    this.activeAction = new UIPlace(this.info.user, this.pointCalculator, this.wordSearcher, this.boardService);
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
            case InputComponent.Chatbox:
                if (this.activeAction) {
                    this.discardAction();
                    return true;
                }
                break;
            case InputComponent.Outside:
                if (this.activeAction) {
                    this.discardAction();
                    this.activeComponent = InputComponent.Outside;
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
                throw Error('Unresolved input of type ' + input.type);
        }
    }

    cancel() {
        this.discardAction();
        this.activeComponent = InputComponent.Outside;
    }

    confirm() {
        if (this.activeAction === null) {
            throw Error('Action couldnt be created : no UIAction is active');
        }
        if (!this.canBeExecuted) {
            throw Error('Action couldnt be created : requirements for creation are not met');
        }
        const newAction: Action = this.activeAction.create();
        this.discardAction();
        this.avs.sendAction(newAction);
        this.activeComponent = InputComponent.Outside;
    }

    private discardAction() {
        if (this.activeAction) {
            this.activeAction.destroy();
        }
        this.activeAction = null;
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
                this.activeComponent = InputComponent.Outside;
                break;
            case ENTER:
                // TODO : IF POSSIBLE, MIGRATE 'ENTER' TO UIPLACE DIRECTLY
                this.confirm();
                break;
            default:
                if (this.activeAction) {
                    this.activeAction.receiveKey(keyPressed);
                    return;
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
