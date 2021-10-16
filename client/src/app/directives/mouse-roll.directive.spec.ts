import { TestBed } from '@angular/core/testing';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { MouseRollDirective } from './mouse-roll.directive';

describe('MouseRollDirective', () => {
    let uiInputController: UIInputControllerService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UIInputControllerService],
        });
        uiInputController = TestBed.inject(UIInputControllerService);
    });

    it('should create an instance', () => {
        const directive = new MouseRollDirective(uiInputController);
        expect(directive).toBeTruthy();
    });
});
