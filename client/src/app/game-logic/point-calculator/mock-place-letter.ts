import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

export class MockPlaceLetter extends PlaceLetter {
    constructor(
        player: Player,
        public word: string,
        public placement: PlacementSetting,
        pointCalculator: PointCalculatorService,
        wordSearcher: WordSearcher,
    ) {
        super(player, word, placement, pointCalculator, wordSearcher);
    }
    execute(game: OfflineGame) {
        return game;
    }
}
