import { Injectable } from '@angular/core';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { UIPlace } from '@app/GameLogic/actions/uiactions/ui-place';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { InputComponent, UIInput } from '@app/GameLogic/interface/ui-input';

@Injectable({
  providedIn: 'root',
})
export class UIInputControllerService {
  activeComponent = InputComponent.Horse;
  activeAction: UIAction;
  activeLetters: Letter[] = [];

  constructor() {}

  receive(input: UIInput) {
    // TODO : REMOVE NEXT LINE
    console.log("received", input);
    this.dispatch(input)
  }

  dispatch(input: UIInput) {
    switch (input.from) {
      case InputComponent.Board:
        this.activeAction = new UIPlace();
        break;
      case InputComponent.Horse:
        // 
        break;
      default:
        throw new Error("Unresolved input from component " + input.from);
    }
    this.activeComponent = input.from;
  }

  cancel() {
    throw new Error('Method not implemented.');
  }

  confirm() {
    throw new Error('Method not implemented.');
  }
}
