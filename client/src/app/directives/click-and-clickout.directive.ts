import { Directive, HostListener, Input } from '@angular/core';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { InputComponent, InputType } from '@app/GameLogic/interfaces/ui-input';

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
        if (!this.wasInside) {
            if (this.inputController.activeComponent === this.inputComponent) {
                this.inputController.receive({ type: InputType.LeftClick, from: InputComponent.Outside });
            }
        }
        this.wasInside = false;
    }
}
