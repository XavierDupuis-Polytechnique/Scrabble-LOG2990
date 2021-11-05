import { Directive, HostListener } from '@angular/core';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { InputType, UIInput, WheelRoll } from '@app/game-logic/interfaces/ui-input';

@Directive({
    selector: '[appMouseRoll]',
})
export class MouseRollDirective {
    constructor(private inputController: UIInputControllerService) {}

    @HostListener('window:mousewheel', ['$event'])
    mousewheelEventChrome($event: WheelEvent) {
        const direction = $event.deltaY < 0 ? WheelRoll.UP : WheelRoll.DOWN;
        const input: UIInput = { type: InputType.MouseRoll, args: direction };
        this.inputController.receive(input);
    }

    @HostListener('window:DOMMouseScroll', ['$event'])
    mousewheelEventFirefox($event: WheelEvent) {
        const direction = $event.detail < 0 ? WheelRoll.UP : WheelRoll.DOWN;
        const input: UIInput = { type: InputType.MouseRoll, args: direction };
        this.inputController.receive(input);
    }
}
