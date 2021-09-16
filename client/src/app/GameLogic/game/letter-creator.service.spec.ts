/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LetterCreatorService } from './letter-creator.service';

describe('Service: LetterCreator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LetterCreatorService]
    });
  });

  it('should ...', inject([LetterCreatorService], (service: LetterCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
