import { Injectable } from '@angular/core';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

@Injectable({
    providedIn: 'root',
})
export class ActionCreatorService {
    constructor(private pointCalculatorService: PointCalculatorService, private wordSearcher: WordSearcher) {}

    createPlaceLetter(player: Player, wordToPlace: string, placementSetting: PlacementSetting): PlaceLetter {
        return new PlaceLetter(player, wordToPlace, placementSetting, this.pointCalculatorService, this.wordSearcher);
    }

    createExchange(player: Player, lettersToExchange: Letter[]): ExchangeLetter {
        return new ExchangeLetter(player, lettersToExchange);
    }

    createPassTurn(player: Player): PassTurn {
        return new PassTurn(player);
    }
}
