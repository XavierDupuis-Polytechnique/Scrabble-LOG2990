import { Action } from '@app/GameLogic/actions/action';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { UIAction } from '@app/GameLogic/actions/uiactions/ui-action';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

export class UIPlace implements UIAction {
    concernedIndexes = new Set<number>();
    constructor(private player: Player) {}
    get canBeCreated(): boolean {
        throw new Error('Method not implemented.');
    }
    receiveRightClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveLeftClick(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    receiveKey(key: string): void {
        throw new Error('Method not implemented.');
    }
    receiveRoll(args: unknown): void {
        throw new Error('Method not implemented.');
    }
    create(): Action {
        return new PlaceLetter(
            this.player,
            '',
            { direction: 'h', x: 0, y: 0 },
            new PointCalculatorService(new BoardService()),
            new WordSearcher(new BoardService(), new DictionaryService()),
        );
    }
}
