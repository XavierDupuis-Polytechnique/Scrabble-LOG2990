import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appPreventContextMenu]',
})
export class PreventContextMenuDirective {
    @HostListener('contextmenu', ['$event'])
    onRightClick(event: { preventDefault: () => void }) {
        event.preventDefault();
    }
}
