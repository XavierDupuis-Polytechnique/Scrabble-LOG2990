import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/solo-game/game';
import { PlacementSetting } from '@app/GameLogic/interfaces/placement-setting.interface';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

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
    execute(game: Game) {
        return game;
    }
}
