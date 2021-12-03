import { Directive, HostListener, Input } from '@angular/core';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { InputComponent, InputType } from '@app/game-logic/interfaces/ui-input';

@Directive({
    selector: '[appClickAndClickout]',
})
export class ClickAndClickoutDirective {
    @Input() inputComponent: InputComponent;

    private wasInside = false;

    constructor(private inputController: UIInputControllerService) {}

    @HostListener('click')
    clickInside() {
        this.wasInside = true;
    }

    @HostListener('document:click')
    clickOutside() {
        if (this.wasInside) {
            this.wasInside = false;
            return;
        }
        if (this.inputController.activeComponent === this.inputComponent) {
            this.inputController.receive({ type: InputType.LeftClick, from: InputComponent.Outside });
        }
    }
}
