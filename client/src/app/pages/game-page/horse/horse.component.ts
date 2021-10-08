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

    inputType = InputType;

    playerRack: Letter[];

    constructor(private info: GameInfoService) {}

    ngAfterContentInit(): void {
        this.playerRack = this.info.user.letterRack;
    }

    click(type: InputType, letter: Letter) {
        let input: UIInput = { from: InputComponent.Horse, type, args: letter }
        this.clickLetter.emit(input);
    }
}
