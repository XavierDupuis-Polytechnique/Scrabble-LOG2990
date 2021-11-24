import { DictionaryServerService } from '@app/db-manager-services/dictionary-manager/dictionary-server.service';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { expect } from 'chai';

describe('DictionaryService', () => {
    const dictionaryService = new DictionaryService(new DictionaryServerService());
    dictionaryService.makeGameDictionary('gameToken', DEFAULT_DICTIONARY_TITLE);

    it('should return true if word is in dictionary', () => {
        expect(dictionaryService.isWordInDict('Bateau', 'gameToken')).to.equal(true);
    });

    it('should return false if word is not in dictionary', () => {
        expect(dictionaryService.isWordInDict('tsfadsf', 'gameToken')).to.equal(false);
    });
});
