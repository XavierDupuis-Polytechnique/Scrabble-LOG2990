import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from '@app/game-logic/interfaces/ui-input';
import { PreventContextMenuDirective } from './prevent-context-menu.directive';

describe('PreventContextMenuDirective', () => {
    it('should create an instance', () => {
        const directive = new PreventContextMenuDirective();
        expect(directive).toBeTruthy();
    });
});

@Component({
    selector: 'app-test-component',
    template: '<div appPreventContextMenu></div>',
})
class TestComponent {
    self: InputComponent;
}

describe('PreventContextMenuDirective', () => {
    let directive: PreventContextMenuDirective;
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [TestComponent, PreventContextMenuDirective],
        }).createComponent(TestComponent);
        directive = new PreventContextMenuDirective();
        fixture.detectChanges();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should call the preventDefault method of an event to prevent the context menu', () => {
        const event = new Event('leftClick');
        const preventDefaultSpy = spyOn(event, 'preventDefault');
        directive.onRightClick(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
});
