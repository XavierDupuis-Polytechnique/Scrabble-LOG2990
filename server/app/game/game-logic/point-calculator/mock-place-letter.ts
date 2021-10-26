import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';

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
    execute(game: ServerGame) {
        return game;
    }
}
