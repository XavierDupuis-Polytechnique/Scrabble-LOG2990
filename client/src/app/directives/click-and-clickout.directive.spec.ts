import { TestBed } from '@angular/core/testing';
import { UIInputControllerService } from '@app/GameLogic/actions/uiactions/ui-input-controller.service';
import { ClickAndClickoutDirective } from './click-and-clickout.directive';

describe('ClickAndClickoutDirective', () => {
    let uiInputController: UIInputControllerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UIInputControllerService],
        });
        uiInputController = TestBed.inject(UIInputControllerService);
    });

    it('should create an instance', () => {
        const directive = new ClickAndClickoutDirective(uiInputController);
        expect(directive).toBeTruthy();
    });
});
