import { TestBed } from '@angular/core/testing';
import { TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE } from '@app/game-logic/constants';
import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { TenWords } from '@app/game-logic/game/objectives/objectives/ten-words/ten-words';

describe('TenWords', () => {
    let objective: TenWords;
    // let action: PlaceLetter;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        objective = new TenWords(TestBed.inject(ObjectiveNotifierService));
        // action = jasmine.createSpyObj(Action, ['execute']);
    });

    it('should be created', () => {
        expect(objective).toBeTruthy();
    });

    it('should complete', () => {
        // const params: ObjectiveUpdateParams = {
        //     previousGrid: [],
        //     currentGrid: [],
        //     lettersToPlace: [],
        //     formedWords: [],
        // };
        for (let i = 0; i < TEN_WORDS_NUMBER_OF_WORDS_TO_PLACE; i++) {
            objective.updateProgression(/* action, params*/);
        }
        expect(objective.progression).toBe(1);
    });
});
