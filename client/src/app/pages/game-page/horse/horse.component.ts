import { AfterContentChecked, Component, EventEmitter, Output } from '@angular/core';
import { UIExchange } from '@app/game-logic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { UIMove } from '@app/game-logic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/game-logic/interfaces/ui-input';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent implements AfterContentChecked {
    @Output() clickLetter = new EventEmitter();
    readonly self = InputComponent.Horse;

    inputType = InputType;

    playerRack: Letter[];

    constructor(private info: GameInfoService, private inputController: UIInputControllerService) {}

    ngAfterContentChecked(): void {
        this.playerRack = this.info.user.letterRack;
    }

    click(type: InputType, index: number) {
        const input: UIInput = { from: InputComponent.Horse, type, args: index };
        this.clickLetter.emit(input);
    }

    isLetterSelectedForMove(index: number) {
        if (this.inputController.activeAction instanceof UIMove) {
            return this.inputController.activeAction.concernedIndexes.has(index);
        }
        return false;
    }

    isLetterSelectedForExchange(index: number) {
        if (this.inputController.activeAction instanceof UIExchange) {
            return this.inputController.activeAction.concernedIndexes.has(index);
        }
        return false;
    }

    isLetterSelectedForPlace(index: number) {
        if (this.inputController.activeAction instanceof UIPlace) {
            return this.inputController.activeAction.concernedIndexes.has(index);
        }
        return false;
    }
}
