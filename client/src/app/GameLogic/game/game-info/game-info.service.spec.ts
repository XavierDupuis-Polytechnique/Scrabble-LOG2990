import { TestBed } from '@angular/core/testing';

import { GameInfoService } from './game-info.service';

describe('GameInfoService', () => {
  let service: GameInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
