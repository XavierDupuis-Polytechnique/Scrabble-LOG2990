/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommandParserService } from './command-parser.service';

describe('Service: CommandParser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommandParserService]
    });
  });

  it('should ...', inject([CommandParserService], (service: CommandParserService) => {
    expect(service).toBeTruthy();
  }));
});
