import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { Player } from '@app/GameLogic/player/player';

export class UIExchange implements UIAction {
    concernedIndexes = new Set<number>();

    get canBeCreated(): boolean {
        return this.concernedIndexes.size > 0;
    }

    receiveRightClick(args: unknown): void {
        const letterIndex = args as number;
        if (this.concernedIndexes.has(letterIndex)) {
            this.concernedIndexes.delete(letterIndex);
        } else {
            this.concernedIndexes.add(letterIndex);
        }
    }
    receiveLeftClick(args: unknown): void {
        throw new Error('UIExchange should not be able to receive a LeftClick');
    }
    receiveKey(key: string): void {
        throw new Error('UIExchange should not be able to receive a KeyPress');
    }
    create(player: Player): Action {
        const lettersToExchange: Letter[] = [];
        this.concernedIndexes.forEach((index) => {
            lettersToExchange.push(player.letterRack[index]);
        });
        return new ExchangeLetter(player, lettersToExchange);
    }
}
