import { TestBed } from '@angular/core/testing';

import { JvHttpService } from './jv-http.service';

describe('JvHttpService', () => {
  let service: JvHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JvHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
