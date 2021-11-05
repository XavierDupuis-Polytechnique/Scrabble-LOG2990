/* eslint-disable dot-notation */
/* eslint-disable max-classes-per-file */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MouseRollDirective } from '@app/directives/mouse-roll.directive';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { InputComponent, InputType, UIInput, WheelRoll } from '@app/game-logic/interfaces/ui-input';

class MockUIInputControllerService {
    activeComponent: InputComponent;
    receive() {
        return;
    }
}

@Component({
    selector: 'app-test-component',
    template: '<div appMouseRoll></div>',
})
class TestComponent {
    self: InputComponent;
}

describe('MouseRollDirective', () => {
    let directive: MouseRollDirective;
    let uIInputController: UIInputControllerService;
    let fixture: ComponentFixture<TestComponent>;
    let uIInputControllerSpy: jasmine.Spy<(input: UIInput) => void>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            providers: [{ provide: UIInputControllerService, useClass: MockUIInputControllerService }],
            declarations: [TestComponent, MouseRollDirective],
        }).createComponent(TestComponent);
        uIInputController = TestBed.inject(UIInputControllerService);
        directive = new MouseRollDirective(uIInputController);
        fixture.detectChanges();
        uIInputControllerSpy = spyOn(uIInputController, 'receive');
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should call the UIInputController receive method for an UP wheelRoll (Chrome)', () => {
        const event = new WheelEvent('mouseRoll', { deltaY: -1 });
        directive.mousewheelEventChrome(event);
        const expected = { type: InputType.MouseRoll, args: WheelRoll.UP };
        expect(uIInputControllerSpy).toHaveBeenCalledWith(expected);
    });

    it('should call the UIInputController receive method for a DOWN wheelRoll (Chrome)', () => {
        const event = new WheelEvent('mouseRoll', { deltaY: 1 });
        directive.mousewheelEventChrome(event);
        const expected = { type: InputType.MouseRoll, args: WheelRoll.DOWN };
        expect(uIInputControllerSpy).toHaveBeenCalledWith(expected);
    });

    it('should call the UIInputController receive method for an UP wheelRoll (Firefox)', () => {
        const event = new WheelEvent('mouseRoll', { detail: -1 });
        directive.mousewheelEventFirefox(event);
        const expected = { type: InputType.MouseRoll, args: WheelRoll.UP };
        expect(uIInputControllerSpy).toHaveBeenCalledWith(expected);
    });

    it('should call the UIInputController receive method for a DOWN wheelRoll (Firefox)', () => {
        const event = new WheelEvent('mouseRoll', { detail: 1 });
        directive.mousewheelEventFirefox(event);
        const expected = { type: InputType.MouseRoll, args: WheelRoll.DOWN };
        expect(uIInputControllerSpy).toHaveBeenCalledWith(expected);
    });
});
