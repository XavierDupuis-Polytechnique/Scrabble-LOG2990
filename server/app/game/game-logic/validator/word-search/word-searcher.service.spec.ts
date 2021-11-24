import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { MockBoard } from '@app/game/game-logic/validator/word-search/mock-board';
import { MockDictionaryService } from '@app/game/game-logic/validator/word-search/mock-dictionary-service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { expect } from 'chai';

describe('wordSearcherService', () => {
    const mockdictionaryService = new MockDictionaryService();
    const wordSeacherService = new WordSearcher(mockdictionaryService as DictionaryService);

    const grid = new MockBoard().grid;

    it('should be created', () => {
        expect(wordSeacherService).to.not.equal(undefined);
    });

    it('should validate word if word is horizontal', () => {
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 4, y: 0 };
        const mockAction = {
            placement,
            word: 'on',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(true);
    });

    it('should validate word if word is vertical', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 8, y: 8 };
        const mockAction = {
            placement,
            word: 'On',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(true);
    });

    it('should validate word if letter are already placed', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 1, y: 2 };
        const mockAction = {
            placement,
            word: 'bon',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(true);
    });

    it('should validate word if letter are already placed and have neighbour', () => {
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 2, y: 1 };
        const mockAction = {
            placement,
            word: 'bon',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(true);
    });

    it('should invalidate word if letter are already placed and have neighbour', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 3, y: 0 };
        const mockAction = {
            placement,
            word: 'bon',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(false);
    });

    it('should return false if word is not valid (not in dict)', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 8, y: 8 };
        const mockAction = {
            placement,
            word: 'tesfg',
        };
        const answer = wordSeacherService.isWordValid(mockAction as PlaceLetter, grid);
        expect(answer).to.equal(false);
    });
});
