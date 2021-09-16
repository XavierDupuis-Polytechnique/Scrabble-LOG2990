/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { MessagesService } from './messages.service';

describe('Service: Messages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessagesService]
    });
  });

  it('should ...', inject([MessagesService], (service: MessagesService) => {
    expect(service).toBeTruthy();
  }));
});
