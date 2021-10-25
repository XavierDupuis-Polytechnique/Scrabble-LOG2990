import { AfterContentInit, Component, EventEmitter, Output } from '@angular/core';
import { UIExchange } from '@app/GameLogic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { UIMove } from '@app/GameLogic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/GameLogic/actions/ui-actions/ui-place';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput } from '@app/GameLogic/interface/ui-input';

@Component({
    selector: 'app-horse',
    templateUrl: './horse.component.html',
    styleUrls: ['./horse.component.scss'],
})
export class HorseComponent implements AfterContentInit {
    @Output() clickLetter = new EventEmitter();
    @Output() self = InputComponent.Horse;

    inputType = InputType;

    playerRack: Letter[];

    constructor(private info: GameInfoService, private inputController: UIInputControllerService) {}

    ngAfterContentInit(): void {
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
