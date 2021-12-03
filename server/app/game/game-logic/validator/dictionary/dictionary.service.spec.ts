import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { expect } from 'chai';
import { stub } from 'sinon';

describe('DictionaryService', () => {
    let dictionaryService: DictionaryService;
    const dictionaryServerService = new DictionaryServerService();
    stub(dictionaryServerService, 'getUniqueName').returns(DEFAULT_DICTIONARY_TITLE + '_0');
    stub(dictionaryServerService, 'getDictByTitle').returns({
        title: DEFAULT_DICTIONARY_TITLE,
        description: 'TestDict',
        words: ['aa', 'bb', 'cc', 'bateau'],
    });

    beforeEach(() => {
        dictionaryService = new DictionaryService(dictionaryServerService);
        dictionaryService.makeGameDictionary('gameToken1', DEFAULT_DICTIONARY_TITLE);
    });

    it('should return true if word is in dictionary', () => {
        expect(dictionaryService.isWordInDict('Bateau', 'gameToken1')).to.equal(true);
    });

    it('should return false if word is not in dictionary', () => {
        expect(dictionaryService.isWordInDict('tsfadsf', 'gameToken1')).to.equal(false);
    });

    it('should count up if 2 game with same dictionary', () => {
        dictionaryService.makeGameDictionary('gameToken2', DEFAULT_DICTIONARY_TITLE);
        dictionaryService.makeGameDictionary('gameToken3', DEFAULT_DICTIONARY_TITLE);
        expect(dictionaryService.liveDictMap.get('Mon dictionnaire_0')?.currentUsage).to.equal(3);
    });

    it('should delete loaded dictionary', () => {
        dictionaryService.makeGameDictionary('gameToken2', DEFAULT_DICTIONARY_TITLE);
        dictionaryService.deleteGameDictionary('gameToken1');
        expect(dictionaryService.liveDictMap.get('Mon dictionnaire_0')?.currentUsage).to.equal(1);
        dictionaryService.deleteGameDictionary('gameToken2');
        expect(dictionaryService.liveDictMap.get('Mon dictionnaire_0')).to.equal(undefined);
    });

    it('should not delete a dictionary for a game that doesnt exist', () => {
        dictionaryService.deleteGameDictionary('gameToken2');
        expect(dictionaryService.liveDictMap.get('Mon dictionnaire_0')?.currentUsage).to.equal(1);
    });

    it('should return false if game doesnt exist', () => {
        expect(dictionaryService.isWordInDict('Bateau', 'gameToken4')).to.equal(false);
    });

    it('should return false if word is over maxLength', () => {
        expect(dictionaryService.isWordInDict('123456789101112131415', 'gameToken1')).to.equal(false);
    });
});
