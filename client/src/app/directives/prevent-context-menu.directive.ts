import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appPreventContextMenu]',
})
export class PreventContextMenuDirective {
    constructor() {}

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: { preventDefault: () => void }) {
        event.preventDefault();
    }
}
