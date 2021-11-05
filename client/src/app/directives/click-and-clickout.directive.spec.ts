/* eslint-disable dot-notation */
/* eslint-disable max-classes-per-file */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { InputComponent, InputType, UIInput } from '@app/game-logic/interfaces/ui-input';
import { ClickAndClickoutDirective } from './click-and-clickout.directive';

class MockUIInputControllerService {
    activeComponent: InputComponent;
    receive() {
        return;
    }
}

@Component({
    selector: 'app-test-component',
    template: '<div appClickAndClickout [inputComponent]="self"></div>',
})
class TestComponent {
    self: InputComponent;
}

describe('ClickAndClickoutDirective', () => {
    let directive: ClickAndClickoutDirective;
    let uIInputController: UIInputControllerService;
    let fixture: ComponentFixture<TestComponent>;
    let uIInputControllerSpy: jasmine.Spy<(input: UIInput) => void>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            providers: [{ provide: UIInputControllerService, useClass: MockUIInputControllerService }],
            declarations: [TestComponent, ClickAndClickoutDirective],
        }).createComponent(TestComponent);
        uIInputController = TestBed.inject(UIInputControllerService);
        directive = new ClickAndClickoutDirective(uIInputController);
        fixture.detectChanges();
        uIInputControllerSpy = spyOn(uIInputController, 'receive');
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should properly set the wasInside attribute to true following a clickInside', () => {
        directive.clickInside();
        expect(directive['wasInside']).toBeTruthy();
    });

    it('should properly set the wasInside attribute to false following a clickOutside', () => {
        directive['wasInside'] = true;
        directive.clickOutside();
        expect(directive['wasInside']).toBeFalsy();
    });

    it('should call the UIInputController receive method to update the active component to outside', () => {
        const self = InputComponent.Horse;
        directive.inputComponent = self;
        uIInputController.activeComponent = self;
        directive['wasInside'] = false;
        directive.clickOutside();
        expect(directive['wasInside']).toBeFalsy();
        expect(uIInputControllerSpy).toHaveBeenCalledWith({ type: InputType.LeftClick, from: InputComponent.Outside });
    });

    it('should not call the UIInputController receive method when the activeComponent is different from self', () => {
        const self = InputComponent.Horse;
        directive.inputComponent = self;
        uIInputController.activeComponent = InputComponent.Chatbox;
        directive['wasInside'] = false;
        directive.clickOutside();
        expect(directive['wasInside']).toBeFalsy();
        expect(uIInputControllerSpy).toHaveBeenCalledTimes(0);
    });
});
