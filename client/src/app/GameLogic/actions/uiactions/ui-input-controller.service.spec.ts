import { TestBed } from '@angular/core/testing';
import { UIInputControllerService } from './ui-input-controller.service';


describe('UIInputControllerService', () => {
  let service: UIInputControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UIInputControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
