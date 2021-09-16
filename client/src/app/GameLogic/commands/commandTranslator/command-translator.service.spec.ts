import { TestBed } from '@angular/core/testing';

import { CommandTranslatorService } from './command-translator.service';

describe('CommandTranslatorService', () => {
  let service: CommandTranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandTranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
