/* eslint-disable @typescript-eslint/no-require-imports */
import { DictionaryServer } from '@app/dictionary-manager/default-dictionary';
import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { DEFAULT_DICTIONARY_TITLE } from '@app/game/game-logic/constants';
import { expect } from 'chai';
import fs = require('fs');

describe('DictionaryServerService', () => {
    const testPath = 'assets/testingEnvironnement/';
    let service: DictionaryServerService;

    before(() => {
        if (!fs.existsSync(testPath)) {
            fs.mkdirSync(testPath);
            fs.mkdirSync(testPath + 'someGarbageThatShouldBeIgnored');
        }
        if (!fs.existsSync(testPath + 'dictionary.json')) {
            fs.copyFileSync('assets/dictionary.json', testPath + 'dictionary.json');
        }
    });

    beforeEach(() => {
        service = new DictionaryServerService(testPath);
    });

    afterEach(() => {
        fs.readdirSync(testPath).forEach((file: string) => {
            if (file !== 'dictionary.json' && file !== 'someGarbageThatShouldBeIgnored') {
                const dictPath = testPath + file;
                fs.unlinkSync(dictPath);
            }
        });
    });

    after(() => {
        fs.unlinkSync(testPath + 'dictionary.json');
        fs.rmdirSync(testPath + 'someGarbageThatShouldBeIgnored');
        fs.rmdirSync(testPath);
    });

    it('should be created', () => {
        expect(service).to.equal(service);
    });

    it('should check that the default dict exist', () => {
        expect(service.isDictExist(DEFAULT_DICTIONARY_TITLE)).to.equal(true);
    });

    it('should check that a dict doesnt exist', () => {
        expect(service.isDictExist('test')).to.equal(false);
    });

    it('should get the list of dict', () => {
        expect(service.getDictsList()).to.be.an('array');
    });

    it('should return the unique name of a dict', () => {
        expect(service.getUniqueName(DEFAULT_DICTIONARY_TITLE)).to.equal('Mon dictionnaire_0');
    });

    it('should return the unique name of a dict that doesnt exist', () => {
        expect(service.getUniqueName('test')).to.equal('');
    });

    it('should return the dict', () => {
        const result = service.getDictByTitle(DEFAULT_DICTIONARY_TITLE) as DictionaryServer;
        const expected = DEFAULT_DICTIONARY_TITLE;
        expect(result.title).to.equal(expected);
    });

    it('should return false if the dict doesnt exist', () => {
        expect(service.getDictByTitle('test')).to.equal(undefined);
    });

    it('should add a dict', () => {
        const dict = { title: 'testTitle', description: 'testDesc', words: ['aa'] };
        service.addDict(dict);
        const result = service.getDictByTitle('testTitle') as DictionaryServer;
        expect(result.title).to.equal(dict.title);
        expect(service.addDict(dict)).to.equal(false);
    });

    it('should update a dict', () => {
        const oldDict = { title: 'testTitle', description: 'testDesc', words: ['aa'] };
        service.addDict(oldDict);
        const newDict = { title: 'testTitle2', description: 'testDesc2', words: ['aa'] };
        service.updateDict(oldDict, newDict);
        const result1 = service.getDictByTitle('testTitle');
        expect(result1).to.equal(undefined);
        const result2 = service.getDictByTitle('testTitle2') as DictionaryServer;
        expect(result2.title).to.equal(newDict.title);
    });

    it('should not update the default dict', () => {
        const oldDict = { title: DEFAULT_DICTIONARY_TITLE, description: 'testDesc', words: ['aa'] };
        const newDict = { title: 'testTitle2', description: 'testDesc2', words: ['aa'] };
        const result = service.updateDict(oldDict, newDict);
        expect(result).to.equal(false);
    });

    it('should not update a dict that doesnt exist', () => {
        const oldDict = { title: 'doesntExistDict', description: 'testDesc', words: ['aa'] };
        const newDict = { title: 'testTitle2', description: 'testDesc2', words: ['aa'] };
        const result = service.updateDict(oldDict, newDict);
        expect(result).to.equal(false);
    });

    it('should delete a dict', () => {
        const dict1 = { title: 'testTitle', description: 'testDesc', words: ['aa'] };
        service.addDict(dict1);
        const result1 = service.getDictByTitle('testTitle') as DictionaryServer;
        expect(result1.title).to.equal('testTitle');
        service.deleteDict('testTitle');
        const result2 = service.getDictByTitle('testTitle');
        expect(result2).to.equal(undefined);
    });

    it('should not delete the default dict', () => {
        const result = service.deleteDict(DEFAULT_DICTIONARY_TITLE);
        expect(result).to.equal(false);
    });

    it('should not delete a dict that doesnt exist', () => {
        const result = service.deleteDict('test');
        expect(result).to.equal(false);
    });

    it('should drop delete all dicts', () => {
        const dict1 = { title: 'testTitle', description: 'testDesc', words: ['aa'] };
        const dict2 = { title: 'testTitle2', description: 'testDesc2', words: ['aa'] };
        service.addDict(dict1);
        service.addDict(dict2);
        service.dropDelete();
        const result1 = service.getDictByTitle(DEFAULT_DICTIONARY_TITLE) as DictionaryServer;
        expect(result1.title).to.equal(DEFAULT_DICTIONARY_TITLE);
        const result2 = service.getDictByTitle(dict1.title);
        expect(result2).to.equal(undefined);
        const result3 = service.getDictByTitle(dict2.title);
        expect(result3).to.equal(undefined);
    });
});
