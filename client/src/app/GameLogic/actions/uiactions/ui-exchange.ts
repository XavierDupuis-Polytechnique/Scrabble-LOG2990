import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { Player } from '@app/GameLogic/player/player';

export class UIExchange implements UIAction {

    letterIndexes = new Set<number>();

    get canBeCreated(): boolean {
        return this.letterIndexes.size > 0;
    }

    receiveRightClick(args: unknown): void {
        const letterIndex = args as number;
        if (this.letterIndexes.has(letterIndex)) {
            this.letterIndexes.delete(letterIndex);
        } else {
            this.letterIndexes.add(letterIndex);
        }
    }
    receiveLeftClick(args: unknown): void {
        throw new Error('UIExchange should not be able to receive a LeftClick');
    }
    receiveKey(key: string): void {
        throw new Error('UIExchange should not be able to receive a KeyPress');
    }
    create(player: Player): Action {
        let lettersToExchange: Letter[] = []
        this.letterIndexes.forEach(index => {
            lettersToExchange.push(player.letterRack[index]);
        });
        return new ExchangeLetter(player, lettersToExchange);
    }
}
