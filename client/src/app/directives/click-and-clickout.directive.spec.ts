import { UIInputControllerService } from '@app/GameLogic/actions/uiactions/ui-input-controller.service';
import { ClickAndClickoutDirective } from './click-and-clickout.directive';

describe('ClickAndClickoutDirective', () => {
  it('should create an instance', () => {
    const directive = new ClickAndClickoutDirective(new UIInputControllerService());
    expect(directive).toBeTruthy();
  });
});
