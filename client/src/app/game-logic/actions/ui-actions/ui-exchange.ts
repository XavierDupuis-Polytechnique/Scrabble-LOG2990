import { Action } from '@app/game-logic/actions/action';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { UIAction } from '@app/game-logic/actions/ui-actions/ui-action';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { Player } from '@app/game-logic/player/player';

export class UIExchange implements UIAction {
    concernedIndexes = new Set<number>();

    constructor(private player: Player) {}

    get canBeCreated(): boolean {
        return this.concernedIndexes.size > 0;
    }

    receiveRightClick(args: number): void {
        const letterIndex = args;
        if (this.concernedIndexes.has(letterIndex)) {
            this.concernedIndexes.delete(letterIndex);
        } else {
            this.concernedIndexes.add(letterIndex);
        }
    }

    receiveLeftClick(): void {
        return;
    }

    receiveKey(): void {
        return;
    }

    receiveRoll(): void {
        return;
    }

    create(): Action {
        const lettersToExchange: Letter[] = [];
        this.concernedIndexes.forEach((index) => {
            lettersToExchange.push(this.player.letterRack[index]);
        });
        return new ExchangeLetter(this.player, lettersToExchange);
    }

    destroy(): void {
        return;
    }
}
