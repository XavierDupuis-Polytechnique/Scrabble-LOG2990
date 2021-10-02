import { Injectable } from '@angular/core';
import { Dictionary } from '@app/GameLogic/validator/dictionary';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';

@Injectable()
export class MockDictionaryService extends DictionaryService {
    mockDictionary: Dictionary = {
        title: 'dictionnaire',
        description: 'mots',
        words: ['bateau', 'butte', 'allo', 'ou', 'oui', 'nil', 'ni', 'on', 'bon', 'rat', 'bu'],
    };

    isWordInDict(word: string): boolean {
        const dict = new Set(this.mockDictionary.words);
        return dict.has(word);
    }
}
