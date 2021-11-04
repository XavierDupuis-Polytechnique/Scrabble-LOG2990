import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { expect } from 'chai';

describe('DictionaryService', () => {
    const dictionaryService = new DictionaryService();

    it('should return true if word is in disctionary', () => {
        expect(dictionaryService.isWordInDict('Bateau')).to.equal(true);
    });

    it('should return false if word is not in disctionary', () => {
        expect(dictionaryService.isWordInDict('tsfadsf')).to.equal(false);
    });
});
