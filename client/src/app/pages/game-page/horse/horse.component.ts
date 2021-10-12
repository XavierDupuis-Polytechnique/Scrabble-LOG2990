import { AfterContentInit, Component, EventEmitter, Output } from '@angular/core';
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

    constructor(private info: GameInfoService) {}

    ngAfterContentInit(): void {
        this.playerRack = this.info.user.letterRack;
    }

    click(type: InputType, index: number) {
        const input: UIInput = { from: InputComponent.Horse, type, args: this.playerRack[index] };
        this.clickLetter.emit(input);
    }
}
