import { TestBed } from '@angular/core/testing';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DictionaryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true if word is in dictionary', () => {
        expect(service.isWordInDict('Bateau')).toBeTrue();
    });
});
